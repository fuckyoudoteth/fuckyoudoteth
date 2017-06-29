pragma solidity ^0.4.11;

import './ERC20.sol';
import './SafeMath.sol';
import './MultiSigWallet.sol';
import './FuckYouAuction.sol';

contract FuckYouCoin is SafeMath, ERC20 {
  // Dividend information
  uint256 constant pointsMultiplier = 10e18;

  address public fuckYouAuction;

  struct Account {
    uint balance; // FUC balance
    uint dividendBalance; // ETH dividend balance
    uint lastDividendPoints;
  }

  mapping(address=>Account) accounts;
  mapping (address => mapping (address => uint256)) allowed;
  uint totalSupply;
  uint totalDividendPoints;
  uint unclaimedDividends;
  uint lastDispersalBalance;
  uint pendingDispersalBalance;

  // State machine
  enum State{PreFunding, Funding, Funded}

  // Token information
  string public constant name = "FuckYouCoin";
  string public constant symbol = "FUC";
  uint256 public constant decimals = 18;  // decimal places
  uint256 public constant crowdfundPercentOfTotal = 80;
  uint256 public constant devPercentOfTotal = 20;
  uint256 public constant hundredPercent = 100;

  // Crowdsale information
  bool public finalizedCrowdfunding = false;
  uint256 public fundingStartBlock; // crowdsale start block
  uint256 public fundingEndBlock; // crowdsale end block
  uint256 public constant maxTokensPerEther = 1200; // max FUC:ETH exchange rate
  uint256 public constant crowdfundMaxEther = 10000 ether;
  uint256 public constant numberOfFundingDays = 30;
  uint256 constant blocksPerDay = 4800;
  uint256 constant daysOfMaxTokensPerEther = 5;
  uint256 constant dailyLossTokensPerEther = 16;

  address public fuMultisig;

  event DividendWithdrawal(address indexed _from, uint256 _value);

  function FuckYouCoin(
    address _fuMultisig,
    uint256 _fundingStartBlock) {

      if (_fuMultisig == 0) throw;
      if (_fundingStartBlock <= block.number) throw;
      fundingStartBlock = _fundingStartBlock;
      fundingEndBlock = safeAdd(_fundingStartBlock, safeMul(numberOfFundingDays, blocksPerDay));
      fuMultisig = _fuMultisig;
      if (!MultiSigWallet(fuMultisig).isMultiSigWallet()) throw;
  }

  function balanceOf(address who) constant returns (uint) {
    return accounts[who].balance;
  }


  /// @notice Transfer `value` FUC tokens from sender's account
  /// `msg.sender` to provided account address `to`.
  /// @notice This function is disabled during the funding.
  /// @dev Required state: Funded
  /// @param to The address of the recipient
  /// @param value The number of FUC to transfer
  /// @return Whether the transfer was successful or not
  function transfer(address to, uint256 value) updateDividendBalance(msg.sender) returns (bool ok) {
      require(getState() == State.Funded); // Abort if crowdfunding not over
      if (to == 0x0) throw;
      uint256 senderBalance = balanceOf(msg.sender);
      if (senderBalance >= value && value > 0) {

          accounts[msg.sender].balance = safeSub(senderBalance, value);
          accounts[to].balance = safeAdd(balanceOf(to), value);
          Transfer(msg.sender, to, value);
          return true;
      }
      return false;
  }

  /// @notice Transfer `value` FUC tokens from sender 'from'
  /// to provided account address `to`.
  /// @notice This function is disabled during the funding.
  /// @dev Required state: Success
  /// @param from The address of the sender
  /// @param to The address of the recipient
  /// @param value The number of FUC to transfer
  /// @return Whether the transfer was successful or not
  function transferFrom(address from, address to, uint value) updateDividendBalance(from) returns (bool ok) {
      require(getState() == State.Funded); // Abort if crowdfunding not over
      if (to == 0x0) throw;
      uint256 senderBalance = balanceOf(from);
      if (senderBalance >= value && value > 0 &&
          allowed[from][msg.sender] >= value) {

          accounts[from].balance = safeSub(senderBalance, value);
          accounts[to].balance = safeAdd(balanceOf(to), value);
          allowed[from][msg.sender] = safeSub(allowed[from][msg.sender], value);
          Transfer(from, to, value);
          return true;
      }
      return false;
  }


  /// @notice `msg.sender` approves `spender` to spend `value` tokens
  /// @param spender The address of the account able to transfer the tokens
  /// @param value The amount of wei to be approved for transfer
  /// @return Whether the approval was successful or not
  function approve(address spender, uint256 value) returns (bool ok) {
      require(getState() == State.Funded); // Abort if not in Funded state.
      allowed[msg.sender][spender] = value;
      Approval(msg.sender, spender, value);
      return true;
  }

  /// @param owner The address of the account owning tokens
  /// @param spender The address of the account able to transfer the tokens
  /// @return Amount of remaining tokens allowed to spent
  function allowance(address owner, address spender) constant returns (uint) {
      return allowed[owner][spender];
  }

  function() payable {
      // don't accept dividends until crowdfunding is over
      require(finalizedCrowdfunding);
  }

  function tokensPerEther() returns (uint) {
    // block after which tokens per eth drops
    var cutoffBlock = safeAdd(safeMul(blocksPerDay, daysOfMaxTokensPerEther), fundingStartBlock);
    if(block.number < cutoffBlock) {
      return maxTokensPerEther;
    } else {
      // total loss = dailyLoss * (cutoffBlock - currentBlock) / blocksPerDay
      var loss = safeMul(dailyLossTokensPerEther,
          safeDiv(safeSub(cutoffBlock, block.number), blocksPerDay));
      return safeSub(maxTokensPerEther, loss);
    }
  }

  /// @notice Create tokens when funding is active.
  /// @dev Required state: Funding
  /// @dev State transition: -> Funding Success (only if cap reached)
  function create() payable external {
      // Abort if not in Funding Active state.
      // The checks are split (instead of using or operator) because it is
      // cheaper this way.
      require(getState() == State.Funding);

      // Do not allow creating 0 or more than the cap tokens.
      require(msg.value != 0);

      // multiply by exchange rate to get newly created token amount
      uint256 createdTokens = safeMul(msg.value, tokensPerEther());

      // we are creating tokens, so increase the totalSupply
      totalSupply = safeAdd(totalSupply, createdTokens);

      // don't go over the limit!
      require(this.balance <= crowdfundMaxEther);

      // Assign new tokens to the sender
      accounts[msg.sender].balance = safeAdd(accounts[msg.sender].balance, createdTokens);

      // Log token creation event
      Transfer(0, msg.sender, createdTokens);
  }

  /// @notice Finalize crowdfunding
  /// @dev If cap was reached or crowdfunding has ended then:
  /// create FUC for the FU Multisig,
  /// transfer ETH to the FU Multisig address.
  /// @dev Required state: Funded
  function finalizeCrowdfunding() external {
      // Abort if not in Funding Success state.
      require(getState() == State.Funded); // don't finalize unless funded
      require(!finalizedCrowdfunding); // can't finalize twice

      // prevent more creation of tokens
      finalizedCrowdfunding = true;

      // Developer FUC Endowment
      uint256 devTokens = safeDiv(safeMul(totalSupply, devPercentOfTotal), crowdfundPercentOfTotal);
      accounts[fuMultisig].balance = safeAdd(balanceOf(fuMultisig), devTokens);
      Transfer(0, fuMultisig, devTokens);

      totalSupply = safeAdd(totalSupply, devTokens);

      // Transfer ETH to the Lunyr Multisig address.
      if (!fuMultisig.send(this.balance)) throw;
  }

  /// @notice This manages the crowdfunding state machine
  /// We make it a function and do not assign the result to a variable
  /// So there is no chance of the variable being stale
  function getState() public constant returns (State){
       // once we reach success, lock in the state
       if (finalizedCrowdfunding) return State.Funded;
       if (block.number < fundingStartBlock) return State.PreFunding;
       else if (block.number <= fundingEndBlock && this.balance < crowdfundMaxEther) return State.Funding;
       else return State.Funded;
 }

  // dividend logic

  function dividendsOwing(address account) internal returns(uint) {
    var newDividendPoints = totalDividendPoints - accounts[account].lastDividendPoints;
    return (accounts[account].balance * newDividendPoints) / pointsMultiplier;
  }

  modifier updateDividendBalance(address account) {
    var owing = dividendsOwing(account);
    if(owing > 0) {
      unclaimedDividends -= owing;
      accounts[account].dividendBalance += owing;
      accounts[account].lastDividendPoints = totalDividendPoints;
    }
    _;
  }

  function disperse(uint amount) internal {
    totalDividendPoints += (amount * pointsMultiplier / totalSupply);
    unclaimedDividends += amount;
  }

  function updatePendingDispersal() internal {
    if(this.balance > lastDispersalBalance) {
      pendingDispersalBalance += this.balance - lastDispersalBalance;
    }
    lastDispersalBalance = this.balance;
  }

  function resetPendingDispersal() internal {
    pendingDispersalBalance = 0;
    lastDispersalBalance = this.balance;
  }

  function disperseAuctionFunds() {
    FuckYouAuction(fuckYouAuction).beneficiaryWithdraw();
    updatePendingDispersal();
    disperse(pendingDispersalBalance);
    resetPendingDispersal();
  }

  function withdrawDividends() updateDividendBalance(msg.sender) returns (bool) {
      updatePendingDispersal();
      var amount = accounts[msg.sender].dividendBalance;
      if (amount > 0) {
          accounts[msg.sender].dividendBalance = 0;
          if(!msg.sender.send(amount)) {
              accounts[msg.sender].dividendBalance = amount;
              return false;
          }
          DividendWithdrawal(msg.sender, amount);
      }
      return true;
  }
}
