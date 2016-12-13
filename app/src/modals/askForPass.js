/**
 * Author: Sergei Krutov
 * Date: 10/31/15
 * For: SCRYPTmail.com.
 * Version: RC 0.99
 */

define(['react','app'], function (React,app) {


	return React.createClass({

		componentDidMount: function() {
            $('#askforPass').on('shown.bs.modal', function () {
                $('#askPasInput').focus();
                //$( "#askPasSub" ).trigger( "click" ); //todo remove for dev
            });

			$('#askforPass').on('hide.bs.modal', function (event) {
				//console.log('off');
				$('#askPasSub').off('click');
			});
			//$('#askPasInput').focus();

		},

        /**
         *
         * @param {string} action
         * @param {object} event
         */
		handleClick: function(action,event) {
			//app.user.set({id:10});
			switch(action) {
				case 'cancel':
					$('#askforPass').modal('hide');
					break;
				case 'enterPass':
					if(event.keyCode==13){
						$( "#askPasSub" ).trigger( "click" );
					}


					break;

			}
		},

        /**
         *
         * @returns {JSX}
         */
		render: function () {
			return (
				<div className="modal fade" id="askforPass" onKeyDown={this.handleClick.bind(this, 'enterPass')}>
					<div className="modal-dialog">
						<div className="modal-content">
							<div className="modal-header">
								<h4 className="modal-title" id="askPassHeader">Provide Second Password</h4>
							</div>
							<div className="modal-body">
								<div className="form-group">

									<div className="form-group">
										<input type="password" id="askPasInput"  className="form-control  input-lg" placeholder="password"/>
									</div>
                                    <div id="infoPass"></div>
								</div>

							</div>
							<div className="modal-footer">
								<button type="button" className="btn btn-primary" autoFocus id="askPasSub">Submit</button>
								<button type="button" className="btn btn-default" id="askPasCancel" onClick={this.handleClick.bind(this, 'cancel')}>Cancel</button>
							</div>
						</div>
					</div>
				</div>
				);
		}

	});
});