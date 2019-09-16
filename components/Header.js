import React from 'react'
import Head from 'next/head'


class Header extends React.Component {
  render() {
		let title = this.props.title;
    return (
			<div>
				<Head>
					<title>{title}</title>
					<meta charSet="utf-8"/>
  				<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
					{/* <!-- Bootstrap core CSS --> */}
					<link href="static/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet"/>

					{/* <!-- Custom styles for this template --> */}
					<link href="static/css/modern-business.css" rel="stylesheet"/>
				</Head>
				<style jsx global>{`
					body { 
    				padding-top: 0px;
					}
				`}</style>
			</div>
    )
  }
}

export default Header