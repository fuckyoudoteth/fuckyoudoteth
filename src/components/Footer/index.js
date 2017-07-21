import React from 'react'

import { Link } from 'react-router-dom'

const Footer = props => {
  return (
    <footer className='footer'>
      <div className='container'>
        <div className='content has-text-centered'>
          <p>
            <a className='icon' href='https://github.com/fuckyoudoteth/fuckyoudoteth'>
              <i className='fa fa-github'></i>
            </a>
          </p>
          <p>
            <a href='https://github.com/fuckyoudoteth/fuckyoudoteth/blob/master/writing/whitepaper.md'>
              Whitepaper
            </a>
          </p>
          <p><Link to='/about'>Bid</Link></p>
          <p><Link to='/about'>ICO</Link></p>
          <p><Link to='/about'>About</Link></p>
          <p>
            Made with 🖕 by anonymous fucks
          </p>
          <p>
            &copy; 2017 by the FU Collective
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
