import React from 'react'
import Link from 'next/link'

class Verification_form extends React.Component {

  render() {
    return (
      <div>
				<form method ="GET" id="contactForm" noValidate="" action="/verify_profile">
					<div className="control-group form-group">
						<div className="controls">
							<input type="number" className="form-control" placeholder="Code" name="verification_code" required="" data-validation-required-message="Please enter verification code." aria-invalid="false"/>
							<p className="help-block"></p>
						</div>
					</div>

					<button type="submit" className="btn btn-primary" id="sendMessageButton">Create</button>
				</form>
      </div>
    )
  }
}

export default Verification_form