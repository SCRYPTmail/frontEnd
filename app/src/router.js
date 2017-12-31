define(['app','backbone', 'react','jquery','bootstrap','cmpld/splashPage/SplashCollection',
	//,'cmpld/authorized/authCollection'
],
	function (app,Backbone, React,$,Bootstrap,SplashCollection
	//	,AuthCollection
		) {
	return Backbone.Router.extend({
		routes : {
			"":"index",
			"TermsAndConditions" : "terms",
			"PrivacyPolicy" : "privacy",
			"report" : "report",
			"Canary" : "canary",
			"login" : "login",
			"createUser" : "createUser",
			"reportBug" : "reportBug",
			"requestInvitation" : "requestInvitation",
			"forgotPassword" : "forgotPassword",
			"forgotSecret" : "forgotSecret",
            "donateUs":"donate",
			":whatever":"notfound",

			//password protected routes
			"mail/:directory(/:msg)":"mail",
            "retrieveEmailV2/:emailId":"pinMail",
            "retrieveEmail/:emailId":"pinMail",
            "composeEmail/:emailId":"ComposeUnreg",
			"settings/:options(/:msg)":"settings",
			"updateAccount/:options(/:msg)":"updateAccount",
			"logOut":"logOut"


		},
/*
		execute: function(callback, args) {
			console.log('call compose');

			if(app.user.get('uploadInProgress')){
				console.log('fffff')
				$('#infoModHead').html("File Upload In Progress");
				$('#infoModBody').html("Please wait untill file uploading complete");
				$('#infoModal').modal('show');
				callback(false);
			}


			callback(args[0]);

		},

		*/
		before: function(callback, args) {

			//console.log(app.user.get("profileVersion"));


			//var getAuthStatus = APP.controllers.auth_controller.isLogged();
		//	var self = this;
			//}


		},
		initialize: function() {
			//this.loginStatus = new Router();

		},
		index: function () {
			React.render(
				<SplashCollection page={'index'}/>,
				document.getElementById('mainBody'));
		},
		terms: function () {
			//console.log(getAuthStatus);
			React.render(
				<SplashCollection page={'terms'}/>,
				document.getElementById('mainBody'));

		},
		privacy: function () {
		//	console.log(getAuthStatus);
			React.render(
				<SplashCollection page={'privacy'}/>,
				document.getElementById('mainBody'));

		},
		canary: function () {
		//	console.log(getAuthStatus);
			React.render(
				<SplashCollection page={'canary'}/>,
				document.getElementById('mainBody'));

		},
        donate: function () {
            React.render(
                <SplashCollection page={'donate'}/>,
                document.getElementById('mainBody'));
        },

		login: function () {
			React.render(
				<SplashCollection page={'index'}/>,
				document.getElementById('mainBody'));
			$('#loginUser').modal('show');
		},
		createUser: function () {
			React.render(
				<SplashCollection page={'index'}/>,
				document.getElementById('mainBody'));
			$('#createAccount-modal').modal('show');
		},
		reportBug: function () {
			React.render(
				<SplashCollection page={'index'}/>,
				document.getElementById('mainBody'));
			$('#reportBug-modal').modal('show');
		},
		requestInvitation: function () {
			React.render(
				<SplashCollection page={'index'}/>,
				document.getElementById('mainBody'));
			$('#reqInvite').modal('show');
		},
		forgotPassword: function () {
			React.render(
				<SplashCollection page={'forgotPassword'}/>,
				document.getElementById('mainBody'));
		},
		forgotSecret: function () {

            $('head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', '/css/splash.css') );
            $('head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', '/css/animate.min.css') );

            $('link[rel=stylesheet][href="/css/main.css"]').remove();

			React.render(
				<SplashCollection page={'forgotSecret'}/>,
				document.getElementById('mainBody'));
		},
		notfound: function () {
            //console.log('not found');
			Backbone.history.navigate("", {
				trigger : true
			});
		},
        updateAccount: function (options, msg) {

			//Todo disabled for dev
			//if(app.user.get("userLoginToken")==''){
			//	app.restartApp();
			//
			// }

			require(['cmpld/authorized/authCollection'],
				function (AuthCollection) {
					React.render(
						<AuthCollection page={'updateAccount'} versionUpdate={options}/>,
						document.getElementById('mainBody'));
				});

		},
		mail: function (options, msg) {
			//if(app.user.get("profileVersion")==''){
				//self.navigate("login", {trigger: true});
				//Backbone.history.navigate("/updateAccount/1", {
			//		trigger : true
			//	});

			//}else{
				require(['cmpld/authorized/authCollection'],
					function (AuthCollection) {
						//console.log(options);
						React.render(
							<AuthCollection page={'mailBox'} folder={options}/>,
							document.getElementById('mainBody'));
					});
			//}

		},
        pinMail: function (msg) {
            //console.log(msg);
            require(['cmpld/unregistered/unregCollection'],
                function (UnregCollection) {
                    React.render(
                        <UnregCollection page={'readEmail'} emailId={msg}/>,
                        document.getElementById('mainBody'));

                });

        },
        ComposeUnreg: function (msg) {
            //console.log(msg);
            require(['cmpld/unregistered/unregCollection'],
                function (UnregCollection) {
                    React.render(
                        <UnregCollection page={'composeEmail'} emailId={msg}/>,
                        document.getElementById('mainBody'));

                });

        },

		settings:function (options, msg) {
			//if(app.user.get("profileVersion")==''){
				//self.navigate("login", {trigger: true});
			//	Backbone.history.navigate("/updateAccount/1", {
			//		trigger : true
			//	});

			//}else{
			var Profil='';
			require(
				[
					'cmpld/authorized/settings/rightpanel/profile',
					'cmpld/authorized/settings/rightpanel/layout',
					'cmpld/authorized/settings/rightpanel/password',
					'cmpld/authorized/settings/rightpanel/contacts',
					'cmpld/authorized/settings/rightpanel/2step',
					'cmpld/authorized/settings/rightpanel/customDomains',
					'cmpld/authorized/settings/rightpanel/disposableEmails',
					'cmpld/authorized/settings/rightpanel/pgpKeys',
					'cmpld/authorized/settings/rightpanel/webDiv',
					'cmpld/authorized/settings/rightpanel/securityLog',
					'cmpld/authorized/settings/rightpanel/folders',
					'cmpld/authorized/settings/rightpanel/emailFilter',
					'cmpld/authorized/settings/rightpanel/deleteAccount',
					'cmpld/authorized/settings/rightpanel/plan',
                    'cmpld/authorized/settings/rightpanel/blackList',
					'cmpld/authorized/authCollection',
					'cmpld/authorized/updates/updateVersion1'
				],

				function (
					Profile,Layout,
					Password,Contacts,
					Step2,Domains,
					Aliases,Pgp,
					Webdiv,Security,
					Folders,Spam,
					Delete,Plan,blackList,AuthCollection,
					UpdateVersion1
					) {
				switch(options) {
					case 'Profile':
						 Profil= Profile;
						break;
					case 'Layout':
							 Profil= Layout;
						break;

					case 'Password':
							 Profil= Password;
						break;

					case 'Contacts':
							 Profil= Contacts;
						break;

					case 'Custom-Domain':
							 Profil= Domains;
						break;

					case 'Disposable-Aliases':
						 Profil= Aliases;
						break;

					case 'PGP-Keys':
							 Profil= Pgp;
						break;

					case 'WebDiv':
						 Profil= Webdiv;
						break;

					case '2-Step':
							 Profil= Step2;
						break;

					case 'Security-Log':
						 Profil= Security;
						break;

					case 'Folders':
						 Profil= Folders;
						break;

					case 'Filter':
						 Profil= Spam;
						break;
                    case 'Black-List':
                        Profil=  blackList;
                        break;


					case 'Delete-Account':
							 Profil= Delete;
						break;
					case 'Plan':
						 Profil= Plan;
						break;
					case 'updateVersion1':
						Profil= UpdateVersion1;
						break;


				}
				React.render(
					<AuthCollection  page={'settings'} rightPanel={Profil} activePage={options}/>,
					document.getElementById('mainBody')
				);
			});
			//}
		},
		logOut: function () {
			//React.render(
			//location.reload(true);
				//window.location.href = '';
				//<SplashCollection page={'index'}/>,
				//document.getElementById('mainBody')
				//);
		}
	});

});