define(['react'], function (React) {
	return React.createClass({

        getInitialState : function() {
            return {
                year:new Date().getFullYear(),
                month:new Date().toLocaleString('en-us', { month: "short" }),
                day:new Date().getDay(),
            };

        },

		onClick: function() {
			$('.hiddens').toggle();
		},
		render: function () {


		return (

			<section className="services grey-bg" id="section1">
				<div className="container">
					<div className="section-header">
						<h2 className="dark-text">Transparency report</h2>
						<div className="colored-line"></div>
                        {this.state.noRequestTime}
                        <br/>
                        Updated Feb 19, 2017
					</div>
					A <a href="https://en.wikipedia.org/wiki/Warrant_canary" target="_blank">warrant canary</a> is a method by which a communications service provider informs its users that the provider has not been served with a secret subpoena.

					<div className="row sMailTextAlignLeft">
						<p>We have had contact with law enforcement agency, but we have never released user data.</p>

						<p>SCRYPTmail has received a total of
							<ul>
								<li>1 request to access user data</li>
								<li>0 requests were granted</li>
                                <li>We had 4 request from law enforcement agencies to access log file for the specific time for certain users</li>
                                <li>4 requests for access time and IP were granted</li>
							</ul>
						</p>
						<br/>
						<br/>
					</div>

				</div>
			</section>
			);
		}

	});
});