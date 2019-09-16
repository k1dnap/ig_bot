import React from "react";
import Base from '../components/Base'

export default class Add_profile extends React.Component {
  render() {
    return (<div>
			<div className="container">
				<h4>New Instagram profile</h4>
				<form method ="GET" id="contactForm" noValidate="" action="/verify_profile">
					<div className="control-group form-group">
						<div className="controls">
							<input type="text" className="form-control" placeholder="Login" name="login" required="" data-validation-required-message="Please enter your login." aria-invalid="false"/>
							<p className="help-block"></p>
						</div>
					</div>
					<div className="control-group form-group">
						<div className="controls">
							<input type="password" className="form-control" placeholder="Password" name="password" required="" data-validation-required-message="Please enter your password."/>
						<div className="help-block"></div></div>
					</div>
					<div id="success"></div>
					<button type="submit" className="btn btn-secondary" id="sendMessageButton">Create</button>
				</form>
			</div>
			<Base title="Add new profile" nav="Profiles"  />
		</div>)
  }
}