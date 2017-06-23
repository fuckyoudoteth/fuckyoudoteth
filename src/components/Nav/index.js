import React from 'react'

import { Link } from 'react-router-dom'

const Nav = props => {
  return (
    <nav className='nav'>
      <div className='nav-left'>
        <Link className='nav-item'
              to='/'>
          <strong className='content'>
            FU.eth
          </strong>
        </Link>
      </div>
      <div className='nav-right'>
        <Link className='nav-item'
              to='/'>Home</Link>
        <Link className='nav-item'
              to='/bid'>Bid</Link>
        <Link className='nav-item'
              to='/About'>About</Link>
      </div>
    </nav>
  )
}

export default Nav
