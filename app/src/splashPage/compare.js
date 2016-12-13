define(['react'], function (React) {
	return React.createClass({
		handleClick: function(i) {
			switch(i) {
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
		componentDidMount: function() {
            if(this.props.scrollTo=="donate"){
              var thisComp=this;
               setTimeout(function(){
                   thisComp.handleClick('donate');
               },300);

            }
		},
		componentWillUnmount : function() {
		//	clearTimeout(this.interval);
		},
		onClick: function() {
			$('.hiddens').toggle();
		},
		render: function () {

			var styleYes = {
				color: '#006600'
			};
			var styleNA = {
				color: '#aaaa00'
			};

			var overflow = {
				overflow: 'hidden'
			};

		return 	(
			<div>

			<div className="header">

				<div className="overlay-layer">
					<div id="incomp" className="alert alert-warning fade in" style={{"display":"none"}}>
						<button className="close" data-dismiss="alert">×</button>
						<i className="fa-fw fa fa-warning"></i><strong>Warning: </strong><span></span>
					</div>

					<div className="container">

						<div className="row">
							<div className="col-md-12">

								<div className="intro-section">


									<h2 className="intro white-text">Protect your privacy</h2>
									<h5 className="white-text">end-to-end encrypted email with no stored meta data
									</h5>

									<div className="button">
										<a className="btn btn-primary standard-button inpage-scroll" onClick={this.handleClick.bind(this, 'signUp')}>Sign Up For Free</a>
									</div>
								{/*
									<div className="button">

										<a onClick={this.handleClick.bind(this, 'requestInvitation')} className="btn btn-primary standard-button inpage-scroll">Request Invitation</a>
									</div>
									*/}
								</div>

								<div className="browser-image">
									<img src="/img/compose.jpg" className="wow fadeInUp animated" data-wow-duration="1s" alt=""/>
									</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<section className="services grey-bg" id="why">
				<div className="container">

					<div className="section-header">

						<div className="small-text-medium uppercase colored-text">
							Service
						</div>

						<h2 className="dark-text">Why <strong>SCRYPTmail?</strong></h2>

						<div className="colored-line"></div>

						<div className="sub-heading">
							SCRYPTmail hides all of the technical details and delivers usable and secure email; however, if you want to see the code, <a href='https://github.com/SCRYPTmail/scryptmail' target='_blank'>check it out!</a>
						</div>
					</div>


					<div className="row">

						<div className="col-md-4 wow fadeInLeft" data-wow-offset="10" data-wow-duration="1.75s">
							<div className="single-service marginBottom50 border-bottom-hover hasSMailOverlay">

								<div className="service-icon colored-text">
									<span className="iconsplash-basic-heart"></span>
								</div>

								<h3 className="colored-text">Genuine</h3>

								<div className="sMailOverlay" style={overflow}>
									<p className='textMiddle'>
										<strong>We promise not to confuse nor misrepresent your security risks.</strong>
										<br/>
										<br/>
										Trust is the cornerstone of any business, but many companies fall short by trying to emphasize benefits and hide downsides. We promise to be transparent and open in order to provide you with objective information about our technologies.
									</p>
								</div>

							</div>
						</div>

						<div className="col-md-4 wow fadeInLeft" data-wow-offset="10" data-wow-duration="1.75s">
							<div className="single-service marginBottom50 border-bottom-hover hasSMailOverlay">
								<div className="service-icon colored-text">
									<span className="iconsplash-basic-case"></span>
								</div>

								<h3 className="colored-text">Private</h3>

								<div className='sMailOverlay' style={overflow}>
									<p className='textMiddle'>
									Your emails and data are encrypted end-to-end with a secret phrase that never leaves your computer. As a result, we can't scan nor read your emails.
									</p>
								</div>
							</div>
						</div>

						<div className="col-md-4 wow fadeInRight" data-wow-offset="10" data-wow-duration="1.75s">
							<div className="single-service marginBottom50 border-bottom-hover hasSMailOverlay">
								<div className="service-icon colored-text">
									<span className="iconsplash-man-people-streamline-user"></span>
								</div>

								<h3 className="colored-text">Anonymous</h3>

								<div className='sMailOverlay' style={overflow}>
									<p className='textMiddle'>
										<strong> Can you be truly anonymous on internet?</strong>
										<br/>
										<br/>
											Unfortunately, the answer is no. In order to establish a connection with a server, you have to provide an IP address that can be tracked back to your computer. It does not matter if we store logs or not because that is what your provider does.
									</p>
								</div>
							</div>
						</div>

						<div className="col-md-4 wow fadeInLeft" data-wow-offset="10" data-wow-duration="1s">
							<div className="single-service marginBottom50 border-bottom-hover hasSMailOverlay">
								<div className="service-icon colored-text">
									<span className="iconsplash-close-alt2"></span>
								</div>

								<h3 className="colored-text">No Third Party Server Scripts</h3>
								<div className='sMailOverlay' style={overflow}>

									<p className='textMiddle'>
									We deliver all scripts from our servers. No Google Analytics, Facebook or Twitter. While such scripts can be useful to us as a service to track usage, they leak metadata like user information, location and more.
									</p>
								</div>
							</div>
						</div>

						<div className="col-md-4 wow fadeInRight" data-wow-offset="10" data-wow-duration="1s">
							<div className="single-service marginBottom50 border-bottom-hover hasSMailOverlay">
								<div className="service-icon colored-text">
									<span className="iconsplash-basic-elaboration-todolist-check"></span>
								</div>

								<h3 className="colored-text">PGP & NIST Recommendations</h3>

								<div className='sMailOverlay' style={overflow}>
									<p className='textMiddle'>
										<strong>Standard protocol to exchange public keys between users.</strong>
										<br/>
										<br/>
											The email you are about to send will be encrypted by AES with random 256 bit key and then key encrypted with the public key of intended recipient. Only the person having correct private key will be able to read it. We use only open source encryption libraries to ensure public audit.
									</p>
								</div>
							</div>
						</div>

						<div className="col-md-4 wow fadeInRight" data-wow-offset="10" data-wow-duration="1.75s">
							<div className="single-service marginBottom50 border-bottom-hover hasSMailOverlay">
								<div className="service-icon colored-text">
									<span className="iconsplash-basic-world"></span>
								</div>

								<h3 className="colored-text">Grade A HTTPS Encryption</h3>

								<div className='sMailOverlay' style={overflow}>
									<p className='textMiddle'>
										<strong>Heartbleed attack? POODLE or BEAST? - We got you covered.</strong>
										<br/>
										<br/>
											We are regularly testing our service with third party security services to ensure up to date communication protection.
										<br/>
										<br/>
											* Based on Qualys SSL <a href='https://www.ssllabs.com/ssltest/index.html' target='_blank'>evaluation</a>.
									</p>
								</div>
							</div>
						</div>

						<div className="col-md-4 wow fadeInLeft" data-wow-offset="10" data-wow-duration="1.75s">
							<div className="single-service marginBottom50 border-bottom-hover hasSMailOverlay">
								<div className="service-icon colored-text">
									<span className=" iconsplash-basic-lock"></span>
								</div>

								<h3 className="colored-text">Encrypted</h3>

								<div className='sMailOverlay' style={overflow}>
									<p className='textMiddle'>
										<strong>We mean it, no half measures. Your message encrypted from start to finish.</strong>
										<br/>
										<br/>
											Many similar services advertise email encryption, but not all of them truly encrypt your emails. Attachments, recipients, other metadata often are left in clear text. We encrypt all of it!*
										<br/>
										<br/>
											* Not applicable if you are sending an email to third party servers.
									</p>
								</div>
							</div>
						</div>

						<div className="col-md-4 wow fadeInLeft" data-wow-offset="10" data-wow-duration="1.75s">
							<div className="single-service marginBottom50 border-bottom-hover hasSMailOverlay">
								<div className="service-icon colored-text">
									<span className="iconsplash-basic-elaboration-browser-plus"></span>
								</div>

								<h3 className="colored-text">Freedom and Simplicity</h3>

								<div className='sMailOverlay' style={overflow}>
									<p className='textMiddle'>
										<strong>Who told you that privacy should be compromised for simplicity?</strong>
										<br/>
										<br/>
									</p>
								</div>
							</div>
						</div>

						<div className="col-md-4 wow fadeInRight" data-wow-offset="10" data-wow-duration="1.75s">
							<div className="single-service marginBottom50 border-bottom-hover hasSMailOverlay">
								<div className="service-icon colored-text">
									<span className="iconsplash-basic-paperplane"></span>
								</div>

								<h3 className="colored-text">Send Anywhere</h3>

								<div className='sMailOverlay' style={overflow}>
									<p className='textMiddle'>
										<strong>Send email in clear text or encrypted text.</strong>
										<br/>
										<br/>
											Clear text messages will be deleted from our servers immediately after successful delivery to the recipient’s domain. Encrypted messages will require a PIN to unlock and decrypt. You must provide this PIN via another means of communication like in a phone call, via text or in person.
									</p>
								</div>
							</div>
						</div>

					</div>
				</div>
			</section>

			<section className="brief timeline white-bg" id="section9">
				<div className="container">

					<div className="row">

						<div className="col-md-6 timeline-text text-left wow fadeInLeft" data-wow-offset="20" data-wow-duration="1s">
							<div className="small-text-medium uppercase colored-text text-left">
								Progress
							</div>
							
							<h2 className="text-left dark-text"><strong>Continuous</strong> Improvement</h2>
							
							<div className="colored-line-left"></div>
							<p>
								Goals have been set, and features have been delivered.
								<br/>
								<br/>
								We are working very hard on SCRYPTmail. We know private email is not only possible but can also be beautiful and usable. We've delivered excellent features that have made SCRYPTmail a go-to service for end-to-end encrypted email.
								<br/>
								<br/>
								Many of the features built were requested by you. Thanks for your help!
							</p>
						</div>

			
						<div className="col-md-6 timeline-section wow fadeInRight" data-wow-offset="20" data-wow-duration="1.75s">
							<ul className="vertical-timeline" id="timeline-scroll">
								<li className='first'>
									<div className="date small-text dark-text strong">
										July 3 '14
									</div>
									
									<div className="iconsplash-container color-bg white-text">
										<span className="iconsplash-lightbulb-alt"></span>
									</div>
									
									<div className="info">
										With a strong knowledge of symmetric and asymmetric encryption, Sergei set out to build an email platform he would want to use.
									</div>
								</li>
						
								<li>
									<div className="date small-text dark-text strong">
										Sep 8 '14
									</div>
									<div className="iconsplash-container color-bg white-text">
										<span className="iconsplash-software-pencil"></span>
									</div>
									<div className="info">
										After many Hackathons, RedBulls, and beers Sergei and Aaron completed the development of a Zero Knowledge architecture.
									</div>
								</li>
							
								<li>
									<div className="date small-text dark-text strong">
										Nov 18 '14
									</div>
									<div className="iconsplash-container color-bg white-text">
										<span className="iconsplash-basic-bolt"></span>
									</div>
									<div className="info">
										SCRYPTmail was built and posted for limited beta usage. Sergei barely slept - it was amazing!
									</div>
								</li>
						
								<li>
									<div className="date small-text dark-text strong">
										Dec 10 '14
									</div>
									<div className="iconsplash-container color-bg white-text">
										<span className="iconsplash-basic-elaboration-calendar-check"></span>
									</div>
									<div className="info">
										After prioritizing early adopter requests, we developed encrypted attachments, blacklists and folders. Features which many other platforms are yet to deliver on.
									</div>
								</li>
	
								<li>
									<div className="date small-text dark-text strong">
										Dec 15 '14
									</div>
									<div className="iconsplash-container color-bg white-text">
										<span className="iconsplash-basic-elaboration-calendar-check"></span>
									</div>
									<div className="info">
										We welcomed Tori as our editor and marketing strategist.
									</div>
								</li>
			
								<li>
									<div className="date small-text dark-text strong">
										Dec 31 '14
									</div>
									<div className="iconsplash-container color-bg white-text">
										<span className="iconsplash-ecommerce-graph-increase"></span>
									</div>
									<div className="info">
										SCRYPTmail became open for full beta registration. You can create an account for free right now!
									</div>
								</li>
	
							</ul>
						</div>

					</div>
				</div>
			</section>

			<section className="team grey-bg" id="aboutUs">
				<div className="container">
					<div className="section-header">
						<h2 className="dark-text"><strong>SCRYPTmail</strong> Team</h2>
						<div className="colored-line"></div>
						<div className="sub-heading">
                            We are passionate about creating a secure and user friendly email service.
						</div>
					</div>

					<div className="row wow fadeIn" data-wow-offset="10" data-wow-duration="1.75s">

					{/* MEMBER
						<div className='col-sm-4'>
							<div className='row'>
								<div className="col-md-8 col-md-offset-2">
									<div className="team-member wow fadeInUp " data-wow-offset="10" data-wow-duration="1s">
										<div className="member-pic hasSMailOverlay">
											<img src="/img/team/tori.jpg" alt=""/>

											<div className='sMailOverlay sMailTextAlignLeft' style={overflow}>
												<p>
													Tori Wilson graduated from the University of Dayton with a degree in Chemical Engineering and a minor in Environmental Engineering. She considers herself a ‘jack of all trades’ type of person though having many varied interests and skills.
													<br/>
													<br/>
													One of her main interests is environmental awareness and conservation. She demonstrates this passion by writing for two environmental based sites (One Green Planet and Earth911). Currently she serves as an editor for SCRYPTmail by proofreading content for the site, blog and other social media.
													<br/>
													<br/>
													Recently she welcomed in a cute new puppy into her home which takes up a lot of her free time.
													<br/>
													<br/>
												</p>
											</div>

										</div>

										<div className="member-details">
											<h5 className="colored-text">Victoria Wilson </h5>
											<div className="small-text">
												Editor
											</div>
											<div className="small-text">
												<a href="mailto:toriwilson@scryptmail.com?Subject=from%20landing" target="_top">toriwilson@scryptmail.com</a>
											</div>
										</div>

									</div>
								</div>
							</div>
						</div>
						*/}
						<div className='col-sm-4 col-md-offset-4'>
							<div className='row'>
								<div className="col-md-8 col-md-offset-2">
									<div className="team-member wow fadeInUp" data-wow-offset="10" data-wow-duration="1s">
										<div className="member-pic hasSMailOverlay">
											<img src="/img/team/sergei1.jpg" alt=""/>
												<div className='sMailOverlay sMailTextAlignLeft' style={overflow} id="serg">
													<p>
														In 2003, Sergei immigrated to the USA from Estonia where he grew up and learned how to code.
														<br/>
														<br/>
														He spent the last 10 years perfecting his skills that include not only writing websites but learning about networking, operating systems and server administration as well.
														<br/>
														<br/>
														Late 2013, he began learning about bitcoin. As a result of finding this area to be cool and challenging, he initially was author of SCRYPTmail.
														<br/>
														<br/>
														In his free time, Sergei enjoys raising his son and doing outdoor activities.
														<br/>
														<br/>

													</p>
												</div>
										</div>

										<div className="member-details">
											<h5 className="colored-text">Sergei Krutov</h5>
											<div className="small-text">Founder</div>
											<div className="small-text">
												<a href="mailto:sergei@scryptmail.com?Subject=from%20landing" target="_top">sergei@scryptmail.com</a>
											</div>
										</div>


									</div>
								</div>
							</div>
						</div>

						{/*
						<div className='col-sm-4'>
							<div className='row'>
								<div className="col-md-8 col-md-offset-2">
									<div className="team-member wow fadeInUp" data-wow-offset="10" data-wow-duration="1s">
										<div className="member-pic hasSMailOverlay">
											<img src="/img/team/aaron.jpg" alt=""/>
											<div className='sMailOverlay sMailTextAlignLeft' style={overflow}>
												<p>
													Aaron began his career as a Physicist building proton accelerators for cancer treatment. He quickly fell in love with the power and applications of computer science and elegantly written software.
													<br/>
													<br/>
													Formally trained in C, C++ and Micro-Controllers, he has spent the last 3 years as a full-stack web programmer.
													<br/>
													<br/>
													With knowledge in symmetrical and asymmetrical encryption and front-end web development (JavaScrypt HTML, CSS), he has made a great addition to the SCRYPTmail Team.
													<br/>
													<br/>
													Aside from busting his ass to help make the most usable end-to-end email service, he is a member of the Cross-fit cult and lover of world travel.
													<br/>
													<br/>
												</p>
											</div>
										</div>

										<div className="member-details">
											<h5 className="colored-text">Aaron Colby</h5>
											<div className="small-text">Developer</div>
											<div className="small-text">
												<a href="mailto:aaron@scryptmail.com?Subject=from%20landing" target="_top">aaron@scryptmail.com</a>
											</div>
										</div>

									</div>
								</div>
							</div>
						</div>
						*/}

					</div>
				</div>
			</section>


			<section className="contact-info white-bg" id="donateUs">
				<div className="container">
					<div className="row contact-links">
						<div className="col-sm-12 text-center">
							<h2 className="dark-text">Support SCRYPTmail</h2>
							<div className="row">
								<div className="col-md-4 wow">
									<div className="single-service marginBottom50 border-bottom-hover hasSMailOverlay">
										<div className="service-icon">
											<h3 className="txt-color-blueLight"><i className="fa fa-bitcoin fa-4x"></i></h3>
										</div>
		
										<div className="sMailOverlay" style={overflow}>
											<p className='textMiddle'>
												<img className="padding-10" src="/img/bitcoinQR.png"/>
												<a className="white-text" href="bitcoin:1CkjAmdQQrj2a5dw7NxfXioJWmNxL9PyGN">1CkjAmdQQrj2a5dw7NxfXioJWmNxL9PyGN</a>
											</p>
										</div>
									</div>
								</div>
		

		
								<div className="col-md-4 wow">
									<div className="single-service marginBottom50 border-bottom-hover hasSMailOverlay">
										<div className="service-icon colored-text">
											<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
												<input type="hidden" name="cmd" value="_s-xclick"/>
												<input type="hidden" name="hosted_button_id" value="B7ERL7QY4HK7Q"/>
												<input type="image" src="/img/pp.jpg" width="200" style={{'margin':'30px','border':"0"}} name="submit" alt="PayPal - The safer, easier way to pay online!"/>
											</form>
										</div>
		
		
									</div>
								</div>
		
							</div>
		
							<span className="iconsplash-basic-mail colored-text"></span>
						</div>
						
						<a href="mailto:support@scryptmail.com?Subject=from%20landing" className="strong">support@scryptmail.com</a>

					</div>
		
				</div>
			</section>


		</div>);
		}

	});
});