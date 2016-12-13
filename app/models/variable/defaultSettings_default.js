/**
 * @desc		stores the POST state and response state of authentication for user
 */
define([
	"app"
], function(app){

	var defaultSettings = Backbone.Model.extend({
		initialize: function(){
			//app.defaults
			//User test data
            this.set({"userName":""})
            this.set({"firstPassfield":""});
            this.set({"secondPassfield":""})
            this.set({'defaultPage':'mail/Inbox'});
            this.set({'domain':'https://scryptmail.com'});
            this.set({"dev":true});

		}


	});

	return defaultSettings;
});
