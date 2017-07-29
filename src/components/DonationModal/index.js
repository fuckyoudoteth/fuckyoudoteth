import React from 'react'
import QRCode from 'qrcode'

const createEthQRCodeDataUrl = (address, amount, cb) => {
  const valueStr = amount && Number(amount) ? `?value=${amount}` : ''

  const uriText = `ethereum:${address}${valueStr}`
  QRCode.toDataURL(uriText, {
    errorCorrectionLevel: 'H',
  }, cb)
}

class DonationModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      amount: 0,
      url: '',
    }
    setTimeout(() => this.setUrl(), 1)
  }
  componentDidUpdate(prevProps, prevState) {
    if(prevProps.donationAddress != this.props.donationAddress ||
       prevState.amount != this.state.amount) {
      this.setUrl()
    }
  }
  setUrl() {
    createEthQRCodeDataUrl(this.props.donationAddress, this.state.amount,
      (err, url) => this.setState({url}))
  }
  render() {
    return (
      <div className={`modal${this.props.open ? ' is-active' : ''}`}>
        <div className='modal-background'
             onClick={this.props.closeModal} />
        <div className='modal-content'>
          <div className='box'>
            <article className='media'>
              <div className='media-left'>
                <figure className='image is-128x128'>
                  <img src={this.state.url} />
                </figure>
              </div>
              <div className='media-content'>
                <p className='content'>
                  <p><strong>Donate</strong></p>
                  {this.props.donationAddress}
                </p>
              </div>
            </article>
          </div>
        </div>
        <div className='modal-close is-large'
             onClick={this.props.closeModal} />
      </div>
    )
  }
}

export default DonationModal
