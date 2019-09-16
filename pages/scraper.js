import React from "react";
import Base from '../components/Base'

export default class Scraper extends React.Component {
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
	async scrape(){
		let acc_to_scrape = document.querySelector('input[name="acc_to_scrape"]').value;
		let login = document.querySelector('select.form-control').value;
		await fetch(`/api/scrape?login=`+login+`&acc_to_scrape=`+acc_to_scrape)
		window.location = '/'
	}
  render() {
		let select_options = this.state.error ? <p>Error on loading profiles</p> 
			: <select className="form-control" name="user_acc">{this.state.data.map( (obj, i)=>{
				return <option  key={i} value={obj.login}>{obj.login}</option> 
			})} </select>;
    return (<div className="container">
			<h4>Scrape followers from profile</h4>
			<div className="control-group form-group">
					<div className="controls">
						<label>Account used for scrape:</label>
						{select_options}
						<p className="help-block"></p>
					</div>
			</div>
			<div className="control-group form-group">
					<div className="controls">
						<label>Account you want to scrape:</label>
						<input type="text" className="form-control" name="acc_to_scrape" required="" data-validation-required-message="Please enter your password."/>
					<div className="help-block"></div></div>
				</div>
			<button type="submit" onClick={this.scrape} className="btn btn-secondary" id="sendMessageButton">Scrape</button>
			
			<Base title="Scraper" nav="Scraper"/>
		</div>)
  }
}