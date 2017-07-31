import React from 'react'

const WhitepaperSection = props => {
  return (
    <section className='whitepaper-section section is-large'
             itemScope itemType='http://schema.org/CreativeWork'>
      <span hidden itemProp='name'>Fuck You Dot Eth: A daily auction and dividend-paying coin</span>
      <span hidden itemProp='author'>the fu collective</span>
      <div className='level'>
        <div className='level-item'>
          <a className='button is-success is-large'
             target='_blank'
             itemProp='url'
             href='https://github.com/fuckyoudoteth/fuckyoudoteth/blob/master/writing/whitepaper.md'>
            Read the Whitepaper
          </a>
        </div>
      </div>
    </section>
  )
}

export default WhitepaperSection
