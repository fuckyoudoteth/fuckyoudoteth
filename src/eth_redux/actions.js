export const SET_ETH_CONNECTION = 'SET_ETH_CONNECTION'

export function setEthConnection(node, connected, network) {
  return {
    type: SET_ETH_CONNECTION,
    node,
    connected,
    network,
  }
}
