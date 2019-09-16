import React from 'react'
import Header from './Header'
import Footer from './Footer'
import Content from './Content'
import Navigation from './Navigation'
import Link from 'next/link'

class Base extends React.Component {
  // componentDidMount() {
  //   this.props.store.start()
  // }

  // componentWillUnmount() {
  //   this.props.store.stop()
  // }
  render() {
		let title = this.props.title
		let nav = this.props.nav
    return (
      <div>
				<Header title={title}/>
				<Navigation nav={nav}/>
				{/* content */}
				<Footer/>
				<br/>
				<br/>
      </div>
    )
  }
}
Base.defaultProps = {
	title: 'Profiles',
	nav: 'Profiles'
}
export default Base