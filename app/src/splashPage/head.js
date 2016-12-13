define(['react'], function (React) {
	return React.createClass({
		handleClick: function(i) {
			switch(i) {
				case 'login':
					$('#loginUser').modal('show');
				break;

				case 'reportBug':
					$('#reportBug-modal').modal('show');
					break;
				case 'requestInvitation':
					$('#reqInvite').modal('show');
					break;
				case 'signUp':
					$('#createAccount-modal').modal('show');
					break;
                case "donate":
                    $('html, body').animate({
                        scrollTop: $("#donateUs").offset().top
                    }, 1000);

                    break;

			}},
		render: function () {
			//console.log(this);

			return (

				<nav className="navbar navbar-fixed-top sticky-navigation navbar-default splashnav">
					<div className="container">

						<div className="navbar-header">
							<button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#stamp-navigation">
								<span className="sr-only">Toggle navigation</span>
								<span className="icon-bar"></span>
								<span className="icon-bar"></span>
								<span className="icon-bar"></span>
							</button>
							<a className="navbar-brand" href='/'>
								<img src="/img/logo/scriptmail_logo.jpg" alt=""/>
							</a>
						</div>

						<div className="navbar-collapse collapse" id="stamp-navigation">

							<ul className="nav navbar-nav navbar-left main-navigation">
								<li><a href="https://blog.scryptmail.com/how-to-use-scryptmail">how to use</a></li>
								<li><a href='http://blog.scryptmail.com/q-a'>Q & A</a></li>
								<li><a href='#donateUs' onClick={this.handleClick.bind(this, 'donate')}>donate</a></li>
								<li><a href='http://blog.scryptmail.com'>blog</a></li>
								<li className="hidden"><a onClick={this.handleClick.bind(this, 'reportBug')}>Report Bug</a></li>
							</ul>


							<ul className="nav navbar-nav navbar-right login-register">
								<li className="login js-login"><a onClick={this.handleClick.bind(this, 'login')}>Login</a>
								</li>
								<li className="register-button js-register inpage-scroll">
									<a className="navbar-register-button" onClick={this.handleClick.bind(this, 'signUp')}>Sign Up For Free</a>
								</li>
							</ul>
						</div>
					</div>
				</nav>
				);
		}

	});
});