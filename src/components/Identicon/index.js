import React from 'react'

const Identicon = props => {
  if(!props.address) {
    return <div />
  }
  const size = props.size || 36
  const style = {
    height: size,
    width: size,
    marginLeft: props.centered ? 'auto' : null,
    marginRight: props.centered ? 'auto' : null,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    borderRadius: '50%',
    boxShadow: 'inset rgba(255, 255, 255, 0.6) 0 2px 2px, inset rgba(0, 0, 0, 0.3) 0 -2px 6px',
    backgroundImage: `url(${blockies.create({seed: props.address, size: 8, scale: 16}).toDataURL()})`
  }
  return (
    <div style={style}>
    </div>
  )
}

export default Identicon
