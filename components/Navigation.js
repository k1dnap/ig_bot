import React from 'react'
import Link from 'next/link'

class Base extends React.Component {
  render() {
		let objs = [
			{name: `Profiles`, href: `/`},
			{name: `Scraper`, href: `scraper`},
		]
		objs.map( obj=>{
			obj.active = (this.props.nav == obj.name? true : false)
		})
    return (
      <div>
				<nav className="navbar  navbar-expand-xs navbar-dark bg-secondary fixed-bottom">
				<ul className="nav navbar-nav flex-row">
					{objs.map( (obj, i)=>{
						return  <li key={i} className={`nav-item `+ (obj.active? `active`: ``)}>
							<Link href={obj.href}><a  className="nav-link pr-3">{obj.name}</a></Link>
						</li>
						
								
					})}
    		</ul>
				</nav>
      </div>
    )
  }
}

export default Base