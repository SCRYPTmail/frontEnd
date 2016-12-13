/**
 * @desc		stores the POST state and response state of authentication for user
 */
define([
	"app"
], function(app){

	var UserModel = Backbone.Model.extend({

		initialize: function(){
		//	_.bindAll.apply(_, [this].concat(_.functions(this)));
		},

		defaults: {
			id: 0,
			username: '',
			name: '',
			email: ''
		},

		url: function(){
			return app.API + '/user';
		}

	});

	return UserModel;
});
