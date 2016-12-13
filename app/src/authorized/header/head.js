define(['react','app'], function (React,app) {
	return React.createClass({
        getInitialState : function() {
            return {
                newVersion:false
            };
        },

		componentDidMount: function () {
			var thisComp=this;
			app.user.on("change:timeLeft",function() {
				thisComp.forceUpdate();
			});

			app.user.on("change:onlineStatus",function() {
				thisComp.forceUpdate();
			});

            app.user.on("change:onlineStatus",function() {
                thisComp.forceUpdate();
            });

            app.user.on("change:pleaseUpdate",function() {
                if(app.user.get('pleaseUpdate')){
                    thisComp.setState({
                        newVersion:true
                    });
                }
                thisComp.forceUpdate();
            });
		},

		handleClick: function(i) {
			$(".navbar-toggle").click();

			switch(i) {

                case 'refreshBrowser':

                    $('#dialogModHead').html("New Version Available");
                    $('#dialogModBody').html("By clicking OK, system will refresh your browser and you will be asked to login again. <br/> Please finish your current task and click OK, or logout and hard refresh your browser");

                    $('#dialogOk').on('click', function () {
                        location.reload(true);
                    });

                    $('#dialogPop').modal('show');

                    break;

				case 'restartQue':
					app.serverCall.restartQue();
					break;
                case 'gotoInbox':
                    app.mixins.canNavigate(function(decision){
                        if(decision){
                            Backbone.history.navigate("/mail/Inbox", {
                                trigger : true
                            });

                        }
                    });

                    break;

				case 'inbox':
					app.mixins.canNavigate(function(decision){
						if(decision){
								Backbone.history.navigate("/mail/Inbox", {
									trigger : true
								});

						}
					});

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

				case 'settings':
					app.mixins.canNavigate(function(decision){
						if(decision){
								Backbone.history.navigate("/settings/Profile", {
									trigger : true
								});
						}
					});


					break;
				case 'logOut':
					app.auth.logout();

					//Backbone.history.navigate("/logOut", {
					//	trigger : true
					//});
					break;

			}},
		//forceUpdate: function (){


		//}.

		componentDidUpdate: function (){

			$('[data-toggle="popover-hover"]').popover({ trigger: "hover" ,container: 'body',html : true});
		},


		render: function ()
		{
			//console.log(this);

			if(app.user.get("onlineStatus")=='offline'){
				var offlineClass="";
			}else{
				var offlineClass="hidden";
			}

			return (
				<nav className="navbar navbar-fixed-top navbar-default authnavigation">

						<div className="navbar-header">
							<button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#stamp-navigation">
								<span className="sr-only">Toggle navigation</span>
								<span className="icon-bar"></span>
								<span className="icon-bar"></span>
								<span className="icon-bar"></span>
							</button>
                            <div className="navbar-toggle collapsed pull-right no-border">
                                <span className={"pull-left badge expirationBadge " +(app.user.get('timeLeft')<100?"bg-color-red ":"bg-color-blueLight ") +(app.user.get('sessionExpiration')==-1?"hidden":"")} title={'Session will expire in '+app.user.get('timeLeft')+ ' sec'}>{app.user.get('timeLeft')}</span>
                            </div>

                            <div className={"navbar-toggle collapsed pull-right newVersion no-border "+(this.state.newVersion?"":"hidden")}>
                                <button className="btn btn-warning btn-xs" data-placement="bottom" data-toggle="popover-hover" data-trigger="focus" title="" data-content="New version released. Please logout, and refresh browser" data-original-title="New Version" onClick={this.handleClick.bind(this, 'refreshBrowser')}>New Verison</button>
                            </div>

							<div className={"navbar-toggle collapsed pull-right connectionError  no-border " +offlineClass}>
								<button className="button" data-placement="bottom" data-toggle="popover-hover" data-trigger="focus" title="" data-content="The system experienced a connection problem. Please reload the page. If the problem persists, please contact us." data-original-title="Connection Error" onClick={this.handleClick.bind(this, 'restartQue')}><i className="fa fa fa-exclamation-circle fa-lg fa-fw txt-color-red"></i></button>


							</div>

							<a className="navbar-brand"  onClick={this.handleClick.bind(this, 'gotoInbox')}>
								<img src="/img/scriptmail_logo.png" alt=""/>
							</a>
						</div>


						<div className="navbar-collapse collapse" id="stamp-navigation">

							<ul className="nav navbar-nav pull-left">
								<li className="hidden"><a href="/#reportBug" target="_blank">Report Bug</a></li>
								<li><a href="https://blog.scryptmail.com/how-to-use-scryptmail" target="_blank">How To</a></li>
								<li><a href='http://blog.scryptmail.com/q-a' target="_blank">Q & A</a></li>
								<li><a href='http://blog.scryptmail.com' target="_blank">Blog</a></li>
							</ul>

							<ul className="nav navbar-nav pull-right">
                                <li className="dropdown">

								<a href="#" className="dropdown-toggle pull-left right-bar" data-toggle="dropdown" role="button" aria-expanded="false">
									<span className={"pull-left badge expirationBadge  hidden-xs " +(app.user.get('timeLeft')<100?"bg-color-red ":"bg-color-blueLight ") +(app.user.get('sessionExpiration')==-1?"hidden":"")} title={'Session will expire in '+app.user.get('timeLeft')+ ' sec'}>{app.user.get('timeLeft')}</span>
								&nbsp;Menu <span className="caret"></span>
								</a>
									<ul className="dropdown-menu" role="menu">
										<li><a onClick={this.handleClick.bind(this, 'inbox')}><i className="ion ion-ios-email-outline  fa-fw"></i> Inbox</a></li>
										<li><a onClick={this.handleClick.bind(this, 'settings')}><i className="ion ion-ios-settings-strong fa-2x text-inverse fa-fw"></i> Settings</a></li>

										<li className="divider"></li>
										<li><a onClick={this.handleClick.bind(this, 'logOut')}><i className="ion ion-android-exit fa-fw"></i> Sign Out</a></li>
									</ul>
								</li>
							</ul>
							<div className={"pull-right newVersion hidden-xs "+(this.state.newVersion?"":"hidden")}>
								<button className="btn btn-warning" data-placement="bottom" data-toggle="popover-hover" data-trigger="focus" title="" data-content="New version is released. Please logout, and refresh you browser" data-original-title="New Version" onClick={this.handleClick.bind(this, 'refreshBrowser')}>New Verison Available</button>


							</div>
                            <div className={"pull-right connectionError " +offlineClass}>
                                <button className="btn btn-default button-noborder" data-placement="bottom" data-toggle="popover-hover" data-trigger="focus" title="" data-content="The system experienced a connection problem. Please reload the page. If the problem persists, please contact us." data-original-title="Connection Error" onClick={this.handleClick.bind(this, 'restartQue')}><i className="fa fa fa-exclamation-circle fa-lg fa-fw txt-color-red"></i></button>


                            </div>

						</div>
				</nav>
				);

		}
	});
});