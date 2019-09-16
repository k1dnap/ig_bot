import React from "react";
import Base from '../components/Base'
import Link from 'next/link'


export default class Profile_main extends React.Component {
	constructor(props) {
		super(props);
		this.state ={ data: {}, scraped_accounts: [], isFetching: true, error: null };
	}
	componentDidMount() {
		this.loadProfileData();
	}
	async loadProfileData(){
		try {
			//load profile data
			let login = window.location.search.split('login=')[1].split('&')[0];
			let result = await fetch(`/api/profile_data?login=`+login);
			let data = await result.json();
			this.setState({data, isFetching: false })
			//load scraped accounts
			result = await fetch(`/api/scraped_accounts`);
			let scraped_accounts = await result.json();
			this.setState({scraped_accounts, isFetching: false })
		} catch (error) {
			this.setState({isFetching: false, error})
		}

	}
	async submitForm(){
		let login = window.location.search.split('login=')[1].split('&')[0];
		let arr = Array.from(document.querySelectorAll('input[name="subcategories[]"]')).filter(el=>el.checked).map(el=>el.value).join('|')

		let result = await fetch(`/api/manage_followers_list?login=`+login+`&arr=`+arr);
	}
	async followAll(){
		let login = window.location.search.split('login=')[1].split('&')[0];
		let result = await fetch(`/api/start_following?login=`+login);
	}
	async deleteProfile(){
		let login = window.location.search.split('login=')[1].split('&')[0];
		let result = await fetch(`/api/delete_profile?login=`+login);
		window.location = '/'

	}
	async openModal(){

	}
	async closeModal(){
		
	}
  render() {
		let profile_data;
		if(this.state.isFetching) profile_data = <p>Loading data</p>
		else if(this.state.error) profile_data = <p>Error on loading data</p>
		else {
			let data = this.state.data;	
			let scraped_accounts = this.state.scraped_accounts;
			let followAll_status = false;
			scraped_accounts = scraped_accounts.length ===0? 'no scraped_accounts': scraped_accounts.map((account, i)=>{
				return <label key={i} onClick={this.submitForm}>
					<input
						type="checkbox" name="subcategories[]"
						value ={account.from}
						defaultChecked={data.followers_list.includes(account.from)? true: false}
					></input>
				{' '+account.from}</label>
			})

			profile_data = <div className="container">
				<h4>{`Profile: `+data.login}</h4>

				{/* manage_follow_list */}
				<button type="button" class="btn btn-secondary" data-toggle="modal" data-target="#exampleModal">
				Manage follow list
				</button>
				<br/>
				<br/>

				<div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
					<div class="modal-dialog" role="document">
						<div class="modal-content">
							<div class="modal-header">
								<h5 class="modal-title" id="exampleModalLabel">Manage follow list</h5>
								<button type="button" class="close" data-dismiss="modal" aria-label="Close">
									<span aria-hidden="true">&times;</span>
								</button>
							</div>
							<div class="modal-body">
							{scraped_accounts}
							</div>
							<div class="modal-footer">
								{/* <button type="button" onClick={this.submitForm} class="btn btn-primary">Save changes</button> */}
								<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
							</div>
						</div>
					</div>
				</div>
								
				<button onClick={this.followAll} className="btn btn-secondary" role="button">Start followAll()</button>
				<br/>
				<br/>
				<button type="button" class="btn btn-danger" data-toggle="modal" data-target="#deleteProfileModal">
				Delete profile
				</button>
				<br/>
				<br/>

				<div class="modal fade" id="deleteProfileModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
					<div class="modal-dialog" role="document">
						<div class="modal-content">
							<div class="modal-header">
								<h5 class="modal-title" id="exampleModalLabel">Are you sure that you want delete profile?</h5>
								<button type="button" class="close" data-dismiss="modal" aria-label="Close">
									<span aria-hidden="true">&times;</span>
								</button>
							</div>
							<div class="modal-footer">
								<button type="button" onClick={this.deleteProfile} class="btn btn-danger">Yes</button>
								<button type="button" class="btn btn-secondary" data-dismiss="modal">No</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		}
		// this.state.data;
		return (<div>
			{profile_data}
			<Base title="Profiles" nav="Profiles"/>
		</div>)
  }
}