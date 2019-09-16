import React from "react";
import Base from '../components/Base'
import Link from 'next/link'

// https://toster.ru/q/582662 - fetch
export default class Profiles extends React.Component {
	constructor(props) {
		super(props);
		this.state ={ data: [], isFetching: true, error: null };
	}
	componentDidMount() {
		this.loadProfiles();
	}
	async loadProfiles(){
		try {
			let result = await fetch(`/api/profiles_all`);
			result = await result.json();
			this.setState({data: result, isFetching: false })
		} catch (error) {
			this.setState({isFetching: false, error})
		}
	}
  render() {
		let profiles = this.state.error ? <p>Error on loading profiles</p> : 	this.state.data.map( (obj, i)=>{
			return  <li key={i}>
				<Link href={'/profile?login='+obj.login}><a>{obj.login}</a></Link>
			</li>
		});

		return (<div>
			{/* content itself */}
			<div className="container">
				<h4>Profiles</h4>
				<Link href="/add_profile"><a className="btn btn-secondary" role="button">+ Add new profile</a></Link>
				<br/>
				<br/>
				{profiles}

				{/* <li><Link href="/add_profile"><a>Profile_sample</a></Link></li> */}
			</div>
			
			<Base title="Profiles" nav="Profiles"/>
		</div>)
  }
}