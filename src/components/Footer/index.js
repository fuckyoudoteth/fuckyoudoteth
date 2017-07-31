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
          <p><Link to='/bid'>Bid</Link></p>
          <p><Link to='/about'>About</Link></p>
          <p>
            made with 🖕 by anonymous fucks
          </p>
          <p>
            &copy; 2017 the fu collective
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
