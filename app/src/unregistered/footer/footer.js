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

			return	(
				<div className="footer">
						<div className="text-align-center">
							<span className="txt-color-white">SCRYPTmail © 2017 - </span>

							<a href="/TermsAndConditions" target="_blank"><span className="txt-color-black">ToS</span></a>

							<a href="/privacypolicy" target="_blank"><span className="txt-color-black">Privacy Policy</span></a>

							<a href="/canary" target="_blank"><span id="add" className="" data-title="add">Canary</span></a>
						</div>

				</div>

				);

		}

	});
});