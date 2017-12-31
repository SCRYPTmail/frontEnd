/**
 * @desc		stores the POST state and response state of authentication for user
 */
define([
	"app"
], function(app){

	var UserLogin = Backbone.Model.extend({
		// Initialize with negative/empty defaults
		// These will be overriden after the initial checkAuth
		defaults: {
			//logged_in: false,
			//user_id: ''
		},
		initialize: function(){
			//_.bindAll.apply(_, [this].concat(_.functions(this)));

			// Singleton user object
			// Access or listen on this throughout any module with app.session.user
		//	this.user = new UserModel({});
		},


		Login: function(emailInput, password,factor2,callback) {

			var arr = emailInput.split("@");

			if (arr.length == 1)
				var email = arr[0].toLowerCase() + app.defaults.get('domainMail');
			else
				var email = emailInput.toLowerCase();

			//console.log(password);
			var post={
				//todo get one step or two before submit, minimize exposure
				username:app.transform.SHA512(email),
				password:app.transform.SHA512(password),
				password2step:app.transform.SHA512(app.globalF.makeDerivedFancy(password, app.defaults.get('hashToken'))),
				factor2:factor2

			}

			app.serverCall.ajaxRequest('loginUser',post,function(result){

				if(result['response']=="success"){
					if(result['data']['status']=="welcome"){


					//	console.log('logged');
					app.user.set({"profileVersion":parseInt(result['data']['userObjectVersion'])});
					app.user.set({"oneStep":result['data']['oneStep']});
					app.user.set({"userLogedIn":true});

					app.user.set({"userLoginToken":result['data']['token']});
					app.user.set({"loginEmail":email});

					app.user.set({"userId": result['data']['userId']});
					app.user.set({"cacheEmId":app.transform.SHA256(email).substring(0, 10)+result['data']['userId']});
					app.user.set({"salt": app.transform.hex2bin(result['data']['salt'])});


					if(result['data']['oneStep']){
						//console.log(password);
                        //console.log(password);
						app.user.set({"secondPassword":app.globalF.makeDerived(password, app.transform.hex2bin(result['data']['salt']))});

						//console.log(app.user.get('secondPassword'));
					}else{
						//console.log(app.user.get('secondPassword'));
					}

					//app.indexedDBWorker.openDb();

					$('#loginUser').modal('hide');

/*
					if(!app.user.get("remeberPassword")){
						//if(result['data']['oneStep']){
							app.user.set({"password":""});
							app.user.set({"secondPassword":""});
						//}else{
						//	app.user.set({"password":""});
						//}
					}
*/
					//console.log(app.user);
					Backbone.history.navigate(app.defaults.get('defaultPage'), {
					//Backbone.history.navigate("mail/Inbox", {
						trigger : true
					});

				callback('good');
					//Backbone.history.navigate("/mail/Inbox", {
					//	trigger : true
					//});

				}else if(result['data']=="needGoogle"){
						callback('needGoogle');
				}else if(result['data']=="needYubi"){
					callback('needYubi');
				}else if(result['data']=="pinWrong"){
						app.notifications.systemMessage('wrongPin');
                    }else if(result['data']=="limitIsReached"){
                        app.notifications.systemMessage('limitIsReached');
                    }

				}else{
					app.notifications.systemMessage('wrngUsrOrPass');
				}
			});

		},
		logout:function(){
			app.serverCall.ajaxRequest('loginOut',{},function(result){
				if(result['response']=="success")
				app.restartApp();
			},function(){});
		}


	});

	return UserLogin;
});