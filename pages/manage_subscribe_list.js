import React from "react";
import Base from '../components/Base'
import Link from 'next/link'

// https://toster.ru/q/582662 - fetch
// export default class Forma extends React.Component {
// 	constructor(props) {
// 			super(props);

// 			this.state ={ data: {}, isFetching: true, error: null };
// 	}

// 	componentDidMount() {
// 			fetch('http://localhost:3001')
// 					.then(response => response.json())
// 					.then(result => this.setState({data: result, isFetching: false }));
// 					.catch(e => {
// 						console.log(e);
// 						this.setState({data: result, isFetching: false, error: e }));
// 					});
// 	}

// 	render() {
// 			const { data, isFetching, error } = this.state;
			
// 			if (isFetching) return <div>...Loading</div>;

// 			if (error) return <div>{`Error: ${e.message}`}</div>;

// 			return <h1>{data.goals[0].gs_id}</h1>;
// 	}


// }
export default class Manage_subscribe_list extends React.Component {
		constructor(props) {
			super(props);
			this.state ={ data: {}, isFetching: true, error: null };
	}
	// 	componentDidMount() {
	// 		fetch('http://localhost:3001')
	// 				.then(response => response.json())
	// 				.then(result => this.setState({data: result, isFetching: false }));
	// }
  render() {
		return (<div>
			<h4>Profiles</h4>
			<Link href="/add_profile"><a class="btn btn-secondary" role="button">+ Add new profile</a></Link>
			<Base title="Profiles" nav="Profiles"/>
		</div>)
  }
}