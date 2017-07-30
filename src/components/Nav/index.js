import React from 'react'

import { Link, NavLink } from 'react-router-dom'

const Nav = props => {
  const navClass='nav-item'
  const navActiveClass='is-active'
  const navHomeActiveClass='is-home'
  return (
    <nav className='nav'>
      <div className='nav-left'>
        <Link className={navClass}
              to='/'>
          <strong className='content'>
            FU.eth
          </strong>
        </Link>
      </div>
      <div className='nav-right'>
        <NavLink className={navClass}
                 activeClassName={navHomeActiveClass}
                 exact={true}
                 to='/'>Home</NavLink>
        <NavLink className={navClass}
                 activeClassName={navActiveClass}
              to='/bid'>Bid</NavLink>
        <NavLink className={navClass}
                 activeClassName={navActiveClass}
                 to='/about'>About</NavLink>
      </div>
    </nav>
  )
}

export default Nav
