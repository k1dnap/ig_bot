import React from "react";
import Base from '../components/Base'
import Verification_form from '../components/Verification_form'
import { fail } from "assert";
//https://stackoverflow.com/questions/45982244/adding-setinterval-to-componentdidmount-in-react
export default class Verify_profile extends React.Component {
	constructor(props) {
    super(props);
    this.state = {status : `creating`, dots: 3};
    console.log(this.state);
	}
	componentDidMount() {
    // Call this function so that it fetch first time right after mounting the component
		this.playDots = setInterval(
      () => this.state.dots >= 3 ?	this.setState({dots: 1}): this.setState({dots: this.state.dots+1}),
      1000
    );
    this.init();
	}
	componentWillUnmount() {
		// Clear the interval right before component unmount
		clearInterval(this.playDots);
	}
	async init(){
		let login = window.location.search.split('login=')[1].split('&')[0];
		let password = window.location.search.split('password=')[1].split('&')[0];
		try {
			//create instagram profile
			await fetch(`/api/verify_profile?action=create&login=`+login+`&password=`+password)
			let status = await this.check();
			this.setState({status})
		} catch (error) {
			console.log(error)
			clearInterval(this.playDots);
			// clearInterval(this.interval);
			this.setState({status: 'fail'})
		}
	}
	async check(){
		let result;
		let login = window.location.search.split('login=')[1].split('&')[0];
		while(!result){
			const response = await fetch(`/api/verify_profile?action=check&login=`+login);
			response = await response.json();
			response = response.status;
			// success||fail||verify
			if (response == 'loading') await new Promise(resolve=>setTimeout(resolve,1000))
			else result = response;
		}
		return result;
	}
	async verify(){
		let login = window.location.search.split('login=')[1].split('&')[0];
		let verification_code = document.querySelector('input[name="verification_code"]').value;
		console.log(verification_code)
		try {
			this.setState({status: 'verifying'})
			await fetch(`/api/verify_profile?action=verify&login=`+login+`&verification_code=`+verification_code)
			let status = await this.check();
			this.setState({status})
		} catch (error) {
			clearInterval(this.playDots);
			// clearInterval(this.interval);
			this.setState({status: 'fail'})
		}
	}
	async sendCode(){
		let login = window.location.search.split('login=')[1].split('&')[0];
		await fetch(`/api/verify_profile?action=sendCode&login=`+login)
		this.setState({status:'submit_code'})
	}
	async redirect(){
		let login = window.location.search.split('login=')[1].split('&')[0];
		setTimeout(() => {
			window.location = '/profile?login='+login
		}, 5000);
	}
  render() {
		let status;
		if (this.state.status == `creating`){
			status = <p>{'Creating profile' + [...Array(this.state.dots).keys()].map(dot=> ' . ').join('')}</p>
		} else if (this.state.status == `fail`){
			status = <p>{'Incorrect login or password, or err_text'}</p>
		} else if (this.state.status == `verify`){<div>
			<h4>Click the button when you're ready to recieve the verification_code</h4>
			<button type="submit" onClick={this.verify} className="btn btn-primary" id="sendMessageButton">Create</button>

		</div>
		} else if (this.state.status == `submit_code`){
			status = <div>
			<h4>Input verification code</h4>
			<div className="control-group form-group">
				<div className="controls">
					<input type="number" className="form-control" placeholder="Code" name="verification_code" required="" data-validation-required-message="Please enter verification code." aria-invalid="false"/>
					<p className="help-block"></p>
				</div>
			</div>
			<button type="submit" onClick={this.verify} className="btn btn-primary" id="sendMessageButton">Verify</button>
			</div>
		} else if (this.state.status == `success`){
			status = <p>Success, redirect</p>
			this.redirect()
		} else if (this.state.status == `verifying`){
			status = <p>{'Verifying profile' + [...Array(this.state.dots).keys()].map(dot=> ' . ').join('')}</p>
		}
    return (<div>
			<div className="container">
				{status}
			</div>
			<Base title="Scraper" nav="Profile" />
		</div>)
  }
}