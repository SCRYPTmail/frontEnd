define(['react','app'], function (React,app) {
	return React.createClass({
        getInitialState: function () {
            return {
                email:"",
                token:"",
                secret:"",
                newPass:"",
                newPassRep:"",
                salt:"",

                emailError:"",
                tokenError:"",
                secretError:"",
                newPassError:"",
                repPassError:"",

                emailSucc:false,
                tokenSucc:false,
                secretSucc:false,
                newPassSucc:false,
                repPassSucc:false,
                generateI:"",

                oneStep:false


            };
        },
        componentDidMount: function () {
        },

		handleChange: function(action,event) {

            switch(action){
                case 'email':
                    var thisComp=this;
                    this.setState({
                        email: event.target.value
                    },function(){
                        thisComp.verifyAccountStep();
                    });
                    break;

                case 'token':
                    this.setState({
                        token: event.target.value
                    });
                    break;

                case 'secret':
                    this.setState({
                        secret: event.target.value
                    });
                    break;
                case 'newPass':
                    this.setState({
                        newPass: event.target.value
                    });
                    break;
                case 'newPassRep':
                    this.setState({
                        newPassRep: event.target.value
                    });
                    break;
                case "getFile":
                    var thisComp=this;
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        thisComp.setState({
                            token:reader.result
                        },function(){
                            thisComp.verifyAccountStep();
                        });
                    }
                    reader.readAsText(event.target.files[0]);

                    break;

            }
		},
        verifyAccountStep:function(){
            var post={
                'email':app.transform.SHA512(this.state.email),
                'tokenHash':app.transform.SHA512(this.state.token)
            };

            var thisComp=this;
            if(this.state.email==""){
                this.setState({
                    emailError:"please provide email"
                });
            }
                if(this.state.email!="" && this.state.token!=""){
                $.ajax({
                    method: "POST",
                    url: "api/checkStepsV2",
                    data: post,
                    dataType: "json"
                })
                    .done(function( msg ) {
                        if(msg['response']=="notFound"){
                            thisComp.setState({
                                tokenError:"Token is not assigned to this email. "
                            });

                        }else if(msg['response']=="success"){
                            thisComp.setState({
                                tokenError:"",
                                emailError:"",
                                emailSucc:true,
                                tokenSucc:true,
                            });
                            thisComp.setState({
                                oneStep:(parseInt(msg['oneStep'])===0?false:true),
                                salt:app.transform.hex2bin(msg['saltS'])
                            });

                        }else{
                            app.notifications.systemMessage('tryAgain');
                        }
                    });
            }

        },
        handleClick: function(action,event) {
            //app.user.set({id:10});

            switch (action) {
                case 'resetPass':
                    var thisComp=this;

                    this.setState({
                        emailError: this.state.email==""?"enter email":"",
                        tokenError:this.state.token==""?"provide token":"",
                        secretError:((this.state.secret=="" && !this.state.oneStep)?"enter second password":""),

                        newPassError:
                            this.state.newPass==""?"enter password":
                                this.state.newPass.length<6?"password is too short. 6 min":
                                    this.state.newPass.length>80?"password is too long. 80 ":"",
                        repPassError:this.state.newPassRep!=this.state.newPass?"password should match":"",
                    },function(){
                        if(
                            thisComp.state.emailError=="" &&
                            thisComp.state.tokenError=="" &&
                            thisComp.state.secretError=="" &&
                            thisComp.state.newPassError=="" &&
                            thisComp.state.repPassError=="" &&
                            thisComp.state.newPassError==thisComp.state.repPassError

                        ){
                            thisComp.setState({
                                'generateI':"fa fa-refresh fa-spin fa-lg"
                            });

                            if(thisComp.state.oneStep===false){

                                var salt = thisComp.state.salt;
                                console.log(thisComp.state.secret);

                                var secretnew = app.globalF.makeDerived(thisComp.state.secret, salt);
                                console.log(secretnew);

                                var tokenAesHash = app.transform.SHA512(thisComp.state.token);

                                //var derivedKey = app.globalF.makeDerived(secretnew, salt);
                                var derivedKey = secretnew;
                                var Test = app.transform.bin2hex(derivedKey);

                                var Part2 = Test.substr(64, 128);
                                var keyA = app.transform.hex2bin(Part2);

                                var tokenAes = app.transform.fromAesBin(keyA, thisComp.state.token);
                                var tokenHash = app.transform.SHA512(tokenAes);

                                var post={
                                    email:app.transform.SHA512(thisComp.state.email),
                                    tokenHash:tokenHash,
                                    tokenAesHash:tokenAesHash
                                }

                                $.ajax({
                                    method: "POST",
                                    url: "api/checkTokenHashesV2",
                                    data: post,
                                    dataType: "json"
                                })
                                    .done(function( msg ) {
                                        if(msg['response']=='success'){

                                                var newPass=app.transform.SHA512(thisComp.state.newPass);
                                                thisComp.changePass(app.transform.SHA512(thisComp.state.email),tokenHash,tokenAesHash,newPass);

                                        }else if(msg['response']=='incorrect'){
                                            thisComp.setState({
                                                secretError:"Incorrect second password",
                                                'generateI':""

                                            });
                                        }else{
                                            app.notifications.systemMessage('tryAgain');
                                            thisComp.setState({
                                                'generateI':""
                                            });
                                        }

                                    });

                            }else{
                                var tokenAesHash = app.transform.SHA512(thisComp.state.token);

                                var newPass=app.transform.SHA512(app.globalF.makeDerivedFancy(thisComp.state.newPass, 'scrypTmail'));
                                var secondPass=app.globalF.makeDerived(this.state.newPass, thisComp.state.salt);

                                thisComp.resetPassAndSecret(thisComp.state.email,tokenHash,tokenAesHash,newPass,secondPass);

                            }

                        }
                    });







                    break;

                case 'browseToken':
                    $('#tokenFile').click();
                    break;
            }
        },

        changePass:function(email,tokenHash,tokenAesHash,newPass){
           var post={
               email:email,
               tokenHash:tokenHash,
               tokenAesHash:tokenAesHash,
               newPass:newPass

           };
            $.ajax({
                method: "POST",
                url: "api/changeLoginPassV2",
                data: post,
                dataType: "json"
            })
                .done(function( msg ) {
                    if(msg['response']=='success'){
                        app.notifications.systemMessage('saved');

                        setTimeout(function(){
                            app.restartApp();
                        },2000);


                    }else if(msg['response']=='incorrect'){
                        app.notifications.systemMessage('wrngSecPass');
                        thisComp.setState({
                            'generateI':""
                        });
                    }else{
                        app.notifications.systemMessage('tryAgain');
                        thisComp.setState({
                            'generateI':""
                        });
                    }


                });

        },

        resetPassAndSecret:function(email,tokenHash,tokenAesHash,newPass,secondPass){

            //todo delete all previous data with this user
            //generate new user
           // app.globalF.resetSecondPass();

            var userAddress = email.toLowerCase().split('@')[0];
            var email = userAddress + '@scryptmail.com';

            var pass = newPass;
            var folderKey = app.globalF.makeRandomBytes(32);
            var salt = this.state.salt;
            var secret =secondPass;
            var thisComp=this;

             app.generate.generateUserObjects(email, pass, secret, folderKey, salt)
                .then(function (userObj) {
                    console.log(tokenAesHash);

                     userObj['newPass']=pass;
                     userObj['oldTokenAesHash']=tokenAesHash;

                    $.ajax({
                        method: "POST",
                        url: "api/resetUserV2",
                        data: userObj,
                        dataType: "json"
                    })
                        .then(function (msg) {

                            if(msg['response']==='fail'){
                                if(msg['data']==='limitIsReached'){
                                    app.notifications.systemMessage('once5min');
                                }else{
                                    app.notifications.systemMessage('tryAgain');
                                }

                            }else if(msg['response']==='success'){
                                $('#tokenModHead').html('Your account was successfully created!');

                                $('#createAccount-modal').modal('hide');
                                $('#tokenModBody').html('Before logging in, please <b>download the secret token</b>. You will need this token to reset your password or secret phrase. You can read more about it in our <a href="https://blog.scryptmail.com/reset-password" target="_blank">blog</a>');


                                $('#tokenModal').modal('show');
                            }


                            thisComp.setState({
                                'generateI':""
                            });

                            console.log(msg)
                        });


                });


            console.log('oppa');
        },

		render: function () {

		return (
			<div id="content" className="container section-header">
					<div className="modal-dialog modal-md">
						<div className="modal-content">

							<fieldset>
								<legend className="">Reset Password<h5><small>Please follow the order</small></h5></legend>

								<div className={"form-group "+(this.state.emailError!=""?"has-error":"") + (this.state.emailSucc?"has-success":"")}>
									<input type="email" name="resetEmail" id="resetPass_email" className="form-control input-lg" placeholder="1. email address" onChange={this.handleChange.bind(this, 'email')} value={this.state.email}/>
                                    <label className={"control-label pull-left "+(this.state.emailError==""?"hidden":"")} htmlFor="resetEmail">{this.state.emailError}</label>
								</div>

                                <div className="clearfix"></div>


								<div className={"input-group form-group "+(this.state.tokenError!=""?"has-error":"") + (this.state.tokenSucc?"has-success":"")}>

                                    <input className="hidden" id="tokenFile" type="file" readOnly onChange={this.handleChange.bind(this, 'getFile')}/>
									<input name="tokenFile" className="form-control input-lg" id="appendbutton" type="text" placeholder="2. secret token" readOnly value={this.state.token}
                                        style={{textOverflow: "ellipsis"}}/>
                                    <div className="input-group-btn">
											<button className="btn btn-primary input-lg" type="button" onClick={this.handleClick.bind(this, 'browseToken')}>
												Browse for Token
											</button>
                                    </div>

								</div>
                                <label className={"control-label pull-left has-error"+(this.state.tokenError==""?"hidden":"")} htmlFor="tokenFile">{this.state.tokenError}</label>

                                <div className="clearfix"></div>

								<div className="form-group pull-left ">
										<a href="http://blog.scryptmail.com/reset-password" type="text" target="_blank">Secret what?</a>
								</div>

                                <div className="clearfix"></div>
                                <div className={"form-group text-left "+ (this.state.oneStep?"":"hidden")}>
                                   Because you are using single password for login and encrypting your emails. Resetting your password will permanently delete all your existing emails and contacts unavailable.<br/> Proceed with caution.
                                </div>

                                <div className={"form-group "+(this.state.secretError!=""?"has-error":"")+ (this.state.oneStep?"hidden":"")}>
									<input type="password" name="secretPhrase" className="form-control input-lg" placeholder="3. second password" onChange={this.handleChange.bind(this, 'secret')} value={this.state.secret}/>
                                    <label className={"control-label pull-left "+(this.state.secretError==""?"hidden":"")} htmlFor="secretPhrase">{this.state.secretError}</label>
								</div>
							</fieldset>
							<hr/>
							<fieldset>
								<div className={"form-group "+(this.state.newPassError!=""?"has-error":"")}>
									<input type="password" name="newPass" className="form-control input-lg" placeholder="4. new password" onChange={this.handleChange.bind(this, 'newPass')} value={this.state.newPass}/>
                                    <label className={"control-label pull-left "+(this.state.newPassError==""?"hidden":"")} htmlFor="newPass">{this.state.newPassError}</label>
								</div>

								<div className={"form-group "+(this.state.repPassError!=""?"has-error":"")}>
									<input type="password" name="newPassRep" className="form-control input-lg" placeholder="5. repeat new password" onChange={this.handleChange.bind(this, 'newPassRep')} value={this.state.newPassRep}/>
                                    <label className={"control-label pull-left "+(this.state.repPassError==""?"hidden":"")} htmlFor="newPassRep">{this.state.repPassError}</label>
								</div>
							</fieldset>

							<footer>
								<div className="form-group">
								<button id="resetPassButton" className="btn btn-primary btn-lg" disabled={(this.state.generateI!=""?true:false)} onClick={this.handleClick.bind(this, 'resetPass')} type="button"><i className={this.state.generateI}></i> Reset Password</button>
								</div>
								</footer>

					</div>
				</div>
			</div>
			);
		}

	});
});