/**
 * Author: Sergei Krutov
 * Date: 10/31/15
 * For: SCRYPTmail.com.
 * Version: RC 0.99
 */

define(['react','app'], function (React,app) {
	return React.createClass({

		componentWillUnmount: function() {
		},

		componentDidMount: function() {
			//developers
			//app.user.set({"secondPassword":app.defaults.get('secondPassfield')});

            if(!app.user.get('oneStep')){
                if(app.defaults.get('dev')){
                    app.user.set({"secondPassword":app.globalF.makeDerived(app.defaults.get('secondPassfield'), app.user.get('salt'))});
                    this.handleClick('SubmitPass');
                }
            }

            $('#secondPass').on('shown.bs.modal', function () {
                $('#second_passField').focus();
            });



		},

        /**
         *
         * @param {string} action
         * @param {object} event
         */
		handleClick: function(action,event) {
			//app.user.set({id:10});
			switch(action) {
                case 'enterPass':
                    if(event.keyCode==13){
                        $( "#submitSecPass" ).trigger( "click" );
                    }
                    break;
				case 'SubmitPass':
					//console.log('dddd')

					if(app.defaults.get('dev')){
					//	app.user.set({"secondPassword":$('#second_pass').val()});
					}

					//app.user.set({"secondPassword":app.globalF.makeDerived($('#second_pass').val(), app.user.get('salt'))});
					$('#secondPass').modal('hide');

					break;

				case 'logOut':
					app.auth.logout();
					break;

                case 'forgotSecondPassword':

                    $('#secondPass').modal('hide');
                    $('#userObjSync').modal('hide');


                    Backbone.history.navigate("forgotSecret", {
                        trigger : true
                    });


                    break;
			}
		},

        /**
         *
         * @returns
         *
         */
		render: function () {
			return (
				<div className="modal fade" id="secondPass" onKeyDown={this.handleClick.bind(this, 'enterPass')}>
					<div className="modal-dialog">
						<div className="modal-content">
							<div className="modal-header">
								<h4 className="modal-title" id="secPassText" >Provide Second Password</h4>
							</div>
							<div className="modal-body">
								<div className="form-group">

									<div className="form-group">
										<input type="password" id="second_passField" className="form-control  input-lg" defaultValue={app.defaults.get('secondPassfield')} placeholder="password"/>
									</div>
								</div>

                                <div className="clearfix"></div>
                                <div className="form-group pull-left">
                                    <a onClick={this.handleClick.bind(this, 'forgotSecondPassword')} className="pull-left">Forgot second password?</a>
                                </div>

							</div>
							<div className="modal-footer">
								<button type="button" className="btn btn-default" onClick={this.handleClick.bind(this, 'logOut')}>Sign Out</button>
								<button type="button" className="btn btn-primary" id="submitSecPass">Submit</button>
							</div>
						</div>
					</div>
				</div>
				);
		}

	});
});