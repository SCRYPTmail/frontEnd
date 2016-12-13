/**
 * Author: Sergei Krutov
 * Date: 10/31/15
 * For: SCRYPTmail.com.
 * Version: RC 0.99
 */

define(['react'], function (React) {
	return React.createClass({
        /**
         *
         * @param {string} action
         * @param {object} event
         */
		handleClick: function(action,event) {
			switch(action) {
				case 'reportBug':
					//requestInvitiation()
					break;
				case 'enterReportBug':
					if(event.keyCode==13){
						//requestInvitiation();
					}
					break;
			}
		},

        /**
         *
         * @returns {JSX}
         */
		render: function () {

			return (
				<div className="modal fade bs-example-modal-sm" id="reportBug-modal" tabIndex="-1" role="dialog" aria-hidden="true">
					<div className="modal-dialog modal-md">

						<div className="modal-content" onKeyDown={this.handleClick.bind(this, 'enterReportBug')}>
							<h4 className="dark-text form-heading">Contact US</h4>

							<form className="registration-form smart-form" id="report-form" action="/submitBug" method="POST">

								<div className="form-group">
									<input className="hidden" type="name" name="name" placeholder="name" id="hname"/>
									<input type="email" name="email" className="form-control input-lg" placeholder="Please provide email address we can use to contact you"/>
								</div>

								<div className="form-group">
											<select className="os" className="form-control input-lg">
												<option value="0" defaultValue disabled>Operating System</option>
												<option value="Windows">Windows</option>
												<option value="Linux">Linux</option>
												<option value="Mac OC">Mac OC</option>
												<option value="Other">Other</option>
											</select> <i></i>
								</div>


								<div className="form-group">
									<select name="device" className="form-control input-lg">
										<option value="0" defaultValue disabled>Device</option>
										<option value="Desktop">Desktop</option>
										<option value="Tablet">Tablet</option>
										<option value="Smartphone">Smartphone</option>
										<option value="Other">Other</option>
									</select> <i></i>
								</div>
                                <div className="form-group">
                                    <select className="browser" className="form-control input-lg">
                                        <option value="0" defaultValue disabled>Browser</option>
                                        <option value="Chrome">Chrome</option>
                                        <option value="Firefox">Firefox</option>
                                        <option value="Safari">Safari</option>
                                        <option value="Other">Other</option>
                                    </select> <i></i>
                                </div>


								<textarea className="form-control textarea-box placeholder" rows="5" name="comment" placeholder="Please explain problem (1000 max)"></textarea>


								<div className="form-group">
									<button  id='reguser' className="btn btn-primary standard-button" type="button" onClick={this.handleClick.bind(this, 'reportBug')}>Submit</button>
								</div>


							</form>
						</div>
					</div>
				</div>

				);
		}

	});
});