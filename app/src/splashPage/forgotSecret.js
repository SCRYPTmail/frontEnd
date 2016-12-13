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
                generateI:"",

                emailSucc:false,
                tokenSucc:false,
                secretSucc:false,
                newPassSucc:false,
                repPassSucc:false,


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
                'tokenAesHash':app.transform.SHA512(this.state.token)
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
                    url: "api/checkTokenV2",
                    data: post,
                    dataType: "json"
                })
                    .done(function( msg ) {
                        if(msg['response']=="notFound"){
                            thisComp.setState({
                                tokenError:"Hmm. Token not match to this email. Do you have another one? "
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

                            if(parseInt(msg['oneStep'])===1){
                                alert('This email use single password. Press ok to be redirected');
                                Backbone.history.navigate("forgotPassword", {
                                    trigger : true
                                });
                            }



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
                        secretError:this.state.secret==""?"enter second password":"",
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
                                var tokenAesHash = app.transform.SHA512(thisComp.state.token);

                                var oldPass=app.transform.SHA512(thisComp.state.secret)
                                var secondPass=app.globalF.makeDerived(this.state.newPass, thisComp.state.salt);

                                thisComp.resetPassAndSecret(thisComp.state.email,tokenAesHash,oldPass,secondPass);

                            }

                        }
                    });



                    break;

                case 'browseToken':
                    $('#sec_tokenFile').click();
                    break;
            }
        },

        resetPassAndSecret:function(email,tokenAesHash,oldPass,secondPass){

            //todo delete all previous data with this user
            //generate new user
            // app.globalF.resetSecondPass();

            var userAddress = email.toLowerCase().split('@')[0];
            var email = userAddress + '@scryptmail.com';

            var pass = oldPass;
            var folderKey = app.globalF.makeRandomBytes(32);
            var salt = this.state.salt;
            var secret =secondPass;
            var thisComp=this;

            app.generate.generateUserObjects(email, pass, secret, folderKey, salt)
                .then(function (userObj) {
                    console.log(tokenAesHash);

                    userObj['oldPass']=pass;
                    userObj['oldTokenAesHash']=tokenAesHash;

                    $.ajax({
                        method: "POST",
                        url: "api/resetUserTwoStepV2",
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
                            }else if(msg['response']==='wrngPass'){
                                thisComp.setState({
                                    'secretError':"password is incorrect"
                                });
                            }


                            thisComp.setState({
                                'generateI':""
                            });

                            console.log(msg)
                        });


                });

        },

        render: function () {

            return (
                <div id="sec_content" className="forgotSecret container section-header">
                    <div className="modal-dialog modal-md">
                        <div className="modal-content">

                            <fieldset>
                                <legend className="">Reset Second Password<h5><small className="text-left">Resetting your second password will permanently delete all your existing emails and contacts. Proceed with caution.</small></h5></legend>

                                <div className={"form-group "+(this.state.emailError!=""?"has-error":"") + (this.state.emailSucc?"has-success":"")}>
                                    <input type="email" name="resetEmail" id="sec_resetPass_email" className="form-control input-lg" placeholder="1. email address" onChange={this.handleChange.bind(this, 'email')} value={this.state.email}/>
                                    <label className={"control-label pull-left "+(this.state.emailError==""?"hidden":"")} htmlFor="resetEmail">{this.state.emailError}</label>
                                </div>

                                <div className="clearfix"></div>


                                <div className={"input-group form-group "+(this.state.tokenError!=""?"has-error":"") + (this.state.tokenSucc?"has-success":"")}>

                                    <input className="hidden" id="sec_tokenFile" type="file" readOnly onChange={this.handleChange.bind(this, 'getFile')}/>
                                    <input name="tokenFile" className="form-control input-lg" id="sec_appendbutton" type="text" placeholder="2. secret token" readOnly value={this.state.token}
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

                                <div className={"form-group "+(this.state.secretError!=""?"has-error":"")+ (this.state.oneStep?"hidden":"")}>
                                    <input type="password" name="secretPhrase" className="form-control input-lg" placeholder="3. first password" onChange={this.handleChange.bind(this, 'secret')} value={this.state.secret}/>
                                    <label className={"control-label pull-left "+(this.state.secretError==""?"hidden":"")} htmlFor="secretPhrase">{this.state.secretError}</label>
                                </div>
                            </fieldset>
                            <hr/>
                            <fieldset>
                                <div className={"form-group "+(this.state.newPassError!=""?"has-error":"")}>
                                    <input type="password" name="newPass" className="form-control input-lg" placeholder="4. new second password" onChange={this.handleChange.bind(this, 'newPass')} value={this.state.newPass}/>
                                    <label className={"control-label pull-left "+(this.state.newPassError==""?"hidden":"")} htmlFor="newPass">{this.state.newPassError}</label>
                                </div>

                                <div className={"form-group "+(this.state.repPassError!=""?"has-error":"")}>
                                    <input type="password" name="newPassRep" className="form-control input-lg" placeholder="5. repeat second password" onChange={this.handleChange.bind(this, 'newPassRep')} value={this.state.newPassRep}/>
                                    <label className={"control-label pull-left "+(this.state.repPassError==""?"hidden":"")} htmlFor="newPassRep">{this.state.repPassError}</label>
                                </div>
                            </fieldset>

                            <footer>
                                <div className="form-group">
                                    <button id="sec_resetPassButton" className="btn btn-primary btn-lg" disabled={(this.state.generateI!=""?true:false)} onClick={this.handleClick.bind(this, 'resetPass')} type="button"><i className={this.state.generateI}></i> Reset Second Password</button>
                                </div>
                            </footer>

                        </div>
                    </div>
                </div>
            );
        }

    });
});