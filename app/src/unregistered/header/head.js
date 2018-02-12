define(['react','app'], function (React,app) {
	return React.createClass({

		componentDidMount: function () {
			var thisComp=this;
			app.user.on("change:onlineStatus",function() {
				thisComp.forceUpdate();
			});
		},

		handleClick: function(i) {
			$(".navbar-toggle").click();

			switch(i) {

				case 'restartQue':
					app.serverCall.restartQue();
					break;

				case 'reportBug':
					$('#reportBug-modal').modal('show');
					break;

				case 'signUp':
					$('#createAccount-modal').modal('show');
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
							<div className={"navbar-toggle collapsed pull-right " +offlineClass} id="connectionError">
								<button className="button button-noborder" data-placement="bottom" data-toggle="popover-hover" data-trigger="focus" title="" data-content="The system experienced a connection problem. Please reload the page. If the problem persists, please contact us." data-original-title="Connection Error"><i className="fa fa fa-exclamation-circle fa-lg fa-fw txt-color-red"></i></button>


							</div>

							<a className="navbar-brand" href='/'>
                                <img src="/img/logo/shield.jpg" alt=""/>
                                <img className="logoname" src="/img/logo/name.jpg" alt=""/>
							</a>
						</div>


						<div className="navbar-collapse collapse" id="stamp-navigation">

							<ul className="nav navbar-nav pull-left">
								<li><a href="/#reportBug" target="_blank">Report Bug</a></li>
								<li><a href="https://blog.scryptmail.com/how-to-use-scryptmail">How To</a></li>
								<li><a href='http://blog.scryptmail.com/q-a'>Invite</a></li>
								<li><a href='http://blog.scryptmail.com'>Blog</a></li>
							</ul>


							<div className={"pull-right " +offlineClass} id="connectionError">
								<button className="btn btn-default button-noborder" data-placement="bottom" data-toggle="popover-hover" data-trigger="focus" title="" data-content="The system experienced a connection problem. Please reload the page. If the problem persists, please contact us." data-original-title="Connection Error" onClick={this.handleClick.bind(this, 'restartQue')}><i className="fa fa fa-exclamation-circle fa-lg fa-fw txt-color-red"></i></button>


							</div>

						</div>
				</nav>
				);

		}
	});
});