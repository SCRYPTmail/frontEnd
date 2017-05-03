define(['react'], function (React) {
	return React.createClass({
			handleClick: function(i) {
				switch(i) {
					case 'terms':
						Backbone.history.navigate("/TermsAndConditions", {
									trigger : true
								});
						break;
					case 'privacy':
						Backbone.history.navigate("/PrivacyPolicy", {
							trigger : true
						});
						break;
					case 'canary':
						Backbone.history.navigate("/Canary", {
							trigger : true
						});
						break;
					case 'reportBug':
						$('#reportBug-modal').modal('show');
						break;

					//default:
					//default code block
				}
			},
		render: function () {

			return	<footer className="footer grey-bg">
			© &nbsp;2017 SCRYPTMail

				<ul className="footer-links small-text">
					<li><a onClick={this.handleClick.bind(this, 'terms')} className="dark-text">Terms</a>
					</li>
					<li><a onClick={this.handleClick.bind(this, 'privacy')} className="dark-text">Privacy</a>
					</li>
					<li className="hidden" ><a onClick={this.handleClick.bind(this, 'reportBug')} className="dark-text">Report</a>
					</li>
					<li><a onClick={this.handleClick.bind(this, 'canary')} className="dark-text">Canary</a>
					</li>
				</ul>

				<ul className="social-icons">
					<li><a href="https://twitter.com/scryptmail" target="_blank"><span className="iconsplash-social-twitter transparent-text-dark"></span></a>
					</li>
				</ul>
			</footer>


		}

	});
});