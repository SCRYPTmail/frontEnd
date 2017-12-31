/**
 * Author: Sergei Krutov
 * Date: 10/31/15
 * For: SCRYPTmail.com.
 * Version: RC 0.99
 */

define(['react','app','validation'], function (React,app,Validation) {
	return React.createClass({
        /**
         *
         * @returns {{compSafe: boolean, secondFactorInput: boolean, fac2Text: string, fac2Type: string}}
         */
		getInitialState: function () {
			return {
				compSafe:false,
				secondFactorInput:false,
				fac2Text:"",
				fac2Type:""

			};
		},

		componentWillUnmount: function() {
			createUserFormValidator = undefined;
		},

		componentDidMount: function() {
			createUserFormValidator = $("#loginUserForm").validate({
				highlight: function(element) {
					$(element).closest('.form-group').addClass('has-error');
				},
				unhighlight: function(element) {
					$(element).closest('.form-group').removeClass('has-error');
					//$(element).closest('.form-group').addClass('has-success');

				},
				errorElement: 'span',
				errorClass: 'help-block pull-left',
				errorPlacement: function(error, element) {
					if(element.parent('.input-group').length) {
						error.insertAfter(element.parent());
					} else {
						error.insertAfter(element);
					}
				}
			});
			$("#LoginForm_username").rules("add", {
				required: true,
				minlength: 2,
				maxlength: 200
			});


			$("#LoginUser_password").rules("add", {
				required: true,
				minlength: 4,
				maxlength: 80
			});

            if(app.defaults.get('dev')===true){
                this.handleClick('login');
            }
		},

        /**
         *
         * @param {string} action
         * @param {object} event
         */
		handleChange: function (action, event) {
			switch (action) {
				case 'enter2FacText':
					this.setState({
						fac2Text:event.target.value
					});
					break

			}
		},

        /**
         *
         * @param {string} action
         * @param {object} event
         */
		handleClick: function(action,event) {
			//app.user.set({id:10});

			switch(action) {
				case 'openDB':
					app.indexedDBWorker.showRecord('');


					break;
				case 'AddData':

					app.indexedDBWorker.addData('','');

					break;

				case 'DeleteStore':

					app.indexedDBWorker.deleteStore('');
					break;
				case 'RemoveOldData':
					app.indexedDBWorker.deleteRecord();

					console.log(app.indexedDBWorker);
					//var request = db.transaction(["user_1"], "readwrite")
					//	.objectStore("user_1")
					//	.delete(["777-44-4444"]);

					//request.onsuccess = function(event) {
					//	alert("Gone");
					//};

					break;


				case 'login':
					var thisComp=this;
					createUserFormValidator.form();

					if (createUserFormValidator.numberOfInvalids() == 0) {
						var email=$('#LoginForm_username').val();
						var password=$('#LoginUser_password').val();
						var factor2=this.state.fac2Text;


						app.indexedDBWorker.set({"allowedToUse":$('#computerSafe').is(':checked')});
						//app.userObjects.retrieveUserObject();

						app.auth.Login(email,password,factor2,function(result){

							if(result=='needGoogle'){
								thisComp.setState({
									secondFactorInput:true
								});

								thisComp.setState({
									fac2Type:1
								});
							}else if(result=='needYubi'){
								thisComp.setState({
									secondFactorInput:true
								});

								thisComp.setState({
									fac2Type:2
								});
							}
						});

					}
					break;
				case 'enterLogin':
					if(event.keyCode==13){
						this.handleClick('login');
					}
					break;
				case 'forgotPassword':
					Backbone.history.navigate("forgotPassword", {
						trigger : true
					});
					$('#loginUser').modal('hide');
					break;
			}
		},
        /**
         *
         * @returns {JSX}
         */
		render: function () {
			return (
				<div className="modal fade bs-example-modal-sm" id="loginUser" tabIndex="-1" role="dialog" aria-hidden="true">
					<div className="modal-dialog modal-md">

						<form className="modal-content" id="loginUserForm" onKeyDown={this.handleClick.bind(this, 'enterLogin')}>
							<h4 className="dark-text form-heading">Login</h4>

                            <div className="alert alert-info text-left ">
                                Now available on TOR: http://scryptmaildniwm6.onion
                            </div>

							<div className="alert alert-info text-left hidden">
                                Now available on TOR: http://scryptmaildniwm6.onion
							</div>
                            <div className="alert alert-info text-left hidden">
                                Choose the next feature for SCRYPTmail <a href="http://blog.scryptmail.com/" target="_blank">http://blog.scryptmail.com</a>
                            </div>

							<div className="form-group">
								<div className="input-group">
									<input type="text" name="email" id="LoginForm_username" className="form-control input-lg" defaultValue={app.defaults.get('userName')} placeholder="email" maxLength="160"/>
									<span className="input-group-addon">{app.defaults.get('domainMail')}</span>
								</div>
							</div>
							<div className="form-group">
								<input type="password" name="pP" id="LoginUser_password" className="form-control  input-lg" defaultValue={app.defaults.get('firstPassfield')} placeholder="password"/>
							</div>

							<div className={"form-group " +(this.state.fac2Type==0?"hidden":"")}>
								<div className="input-group col-xs-12">
									<span className="input-group-addon">
										<i className={"fa fa-google fa-lg "+(this.state.fac2Type==1?"":"hidden")}></i>
										<img className={this.state.fac2Type==2?"":"hidden"} src="/img/yubi.png" width="20"/></span>
									<input type="text" className="form-control input-lg" placeholder="PIN" value={this.state.fac2Text} onChange={this.handleChange.bind(this, 'enter2FacText')}/>

								</div>

							</div>

							<div className="checkbox pull-left hidden">
								<label>
									<input type="checkbox" id="computerSafe" defaultChecked={this.state.compSafe} /> Computer safe?
									</label>
								</div>



							<div className="clearfix"></div>
							<div className="form-group pull-left">
								<a onClick={this.handleClick.bind(this, 'forgotPassword')} className="pull-left">Forgot password?</a>
							</div>
							<div className="form-group">

								<button className="btn btn-primary standard-button" type="button" onClick={this.handleClick.bind(this, 'login')}>Login</button>

                                {/*
								<button className="btn btn-primary standard-button" type="button" onClick={this.handleClick.bind(this, 'openDB')}>Show Record</button>
								<button className="btn btn-primary standard-button" type="button" onClick={this.handleClick.bind(this, 'AddData')}>Add Records</button>

								<button className="btn btn-primary standard-button" type="button" onClick={this.handleClick.bind(this, 'RemoveOldData')}>Delete Records</button>
								<button className="btn btn-primary standard-button" type="button" onClick={this.handleClick.bind(this, 'DeleteStore')}>Delete ObjectStore</button>
								*/}
							</div>

							<a className="hidden" href="http://blog.scryptmail.com/supported-browsers" target="_blank"> Supported Browsers</a>

						</form>
					</div>
				</div>

				);
		}

	});
});