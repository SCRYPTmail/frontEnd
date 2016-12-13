/**
 * Author: Sergei Krutov
 * Date: 10/31/15
 * For: SCRYPTmail.com.
 * Version: RC 0.99
 */

define(['react','app','accounting'], function (React,app,accounting) {
    "use strict";
	return React.createClass({
        getInitialState: function () {
            return {
            lockEmail:false

        };
    },

        /**
         *
         * @param {string} action
         */
		handleClick: function(action) {
			switch(action) {
				case 'deleteAccount':

                    var thisComp=this;
					$('#dialogModHead').html("Delete");
					$('#dialogModBody').html("This action is permanent. Do you want to continue?");
					$('#dialogOk').on('click', function () {
						$('#dialogPop').modal('hide');

						$('#userSyncTitle').html('Deleting Account');
						app.userObjects.set({"modalText":'Preparing'});
						app.userObjects.set({"modalpercentage":5});

						app.userObjects.deletingAccount(thisComp.state.lockEmail,function(result){
							$('#userObjSync').modal('hide');

							if (result['response'] == "success") {
								app.userObjects.set({"modalText":'Removed'});
								app.userObjects.set({"modalpercentage":100});

								$('#dialogModBody').html("Your Account has been marked for deletion. It may take up to 7 days to be removed from our system and backup. Good Bye.");
								$('#dialogOk').on('click', function () {
									setTimeout(function(){
										app.auth.logout();
									},500);

								});

                            $('#dialogPop').modal('show');

                            }else{
								$('#dialogModBody').html("We were unable to remove your account. Please contact us for further assistance");
								$('#dialogOk').on('click', function () {

                                    $('#dialogPop').modal('hide');
                                    //$('#dialogPop').modal('hide');
									//$('#reportBug-modal').modal('show');

								});

                                $('#dialogPop').modal('show');

							}

						});

						$('#userObjSync').modal({
							backdrop: 'static',
							keyboard: true
						});
					});
					$('#dialogPop').modal('show');
				break;
			}


		},
		render: function () {
			var rightClass="Right col-xs-10 sRight";

		return (
			<div className={this.props.classes.rightClass} id="rightSettingPanel">
				<div className="col-md-6 col-sm-12 personal-info ">
					<div className="panel panel-danger">
						<div className="panel-heading">
							<ul className="nav nav-tabs tabbed-nav">
								<li role="presentation" className="active">
									<a>
										<h3 className={this.props.tabs.Header}>Delete Account</h3>
										<h3 className={this.props.tabs.HeaderXS}><i className="ion-trash-b"></i></h3>

									</a>
								</li>
							</ul>
						</div>
						<div className="panel-body">

							<div className="alert alert-warning" role="alert">All data including: emails, history of your account will be permanently destroyed. You will lose access and ability to receive new emails. <br/><br/> Available balace will be lost, as any record regarding your account will be destroyed. All existing email addresses will be held for retention for the next 180 days to protect your privacy and prevent someone registering same email and receiving emails that may be addressed to you. <span className="hidden">If you would like to extend this period up to 365 days, please remove them individually before deleting the account and select your preferred retention period before they are recycled.</span>

                              <br/><br/>  After your account has been deleted, the encrypted data will remain in our backup system for no more than 7 days before becoming permanently unavailable.</div>

                            <div className="form-group pull-left col-xs-12 col-sm-6">
                                <div className="checkbox">
                                    <label>
                                        <input type="checkbox"
                                               checked={this.state.lockEmail}
                                               onChange={this.handleChange.bind(this, 'permanent')} />
                                        Permanently lock your email adrresses*
                                    </label>
                                </div>
                                * Will prevent anyone from registering email addresses you owned.<br/> It's a paid feature cost $2 per email address. Please make sure you have enough funds on your balance.
                            </div>

							<div className="pull-right">
								<button type="button" className="btn btn-danger" onClick={this.handleClick.bind(this, 'deleteAccount')}>Delete Account</button>
							</div>
						</div>
					</div>
				</div>

			</div>
			);
		},

        handleChange: function (i, event) {
            switch (i) {
                case 'permanent':

                    if(!this.state.lockEmail){
                        var emails=app.user.get('allKeys');
                        var balance=app.user.get('userPlan')['balance'];

                        if(balance<(Object.keys(emails).length*2)){
                            var req=accounting.formatMoney((Object.keys(emails).length*2)-balance);
                            $('#infoModHead').html("Insifficient Balance");
                            $('#infoModBody').html("You need "+req+" more to enable this option.");
                            $('#infoModal').modal('show');

                        }else{
                            this.setState({
                                lockEmail:!this.state.lockEmail
                            });
                        }

                    }

                    break;
            }
        }
	});
});