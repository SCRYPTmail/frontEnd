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
			//this.handleClick('SubmitPass');
		},

        /**
         *
         * @param {string} action
         * @param {object} event
         */
		handleClick: function(action,event) {
			//app.user.set({id:10});
			switch(action) {
				case 'Ok':
					$('#tokenModal').modal('hide');
					break;
                case 'downloadToken':

                    var toFile=app.user.get('downloadToken');

                    var element = document.createElement('a');
                    element.setAttribute('href', 'data:attachment/plain;charset=utf-8,' + toFile);
                    element.setAttribute('download', 'secretToken.key');

                    element.style.display = 'none';
                    document.body.appendChild(element);

                    element.click();

                   // window.open('data:attachment/csv;charset=utf-8,' + encodeURI(toFile));


                    document.body.removeChild(element);

             /*       // var tokenAes = toAesToken(keyA, token);
                    // var tokenAesHash = SHA512(tokenAes);

                    var oMyBlob = new Blob([toFile], {type:'text/html'});
                    var toFile=app.user.get('downloadToken');

                    var a = document.createElement('a');
                    a.href = window.URL.createObjectURL(oMyBlob);

                    var name=app.user.get('email');
                    a.download = 'secretToken.key';

                    document.body.appendChild(a);
                    a.click();
*/
                    break;
			}
		},
		render: function () {
			return (
				<div className="modal fade" id="tokenModal">
					<div className="modal-dialog">
						<div className="modal-content">
							<div className="modal-header">
								<h4 className="modal-title" id="tokenModHead"></h4>
							</div>
							<div className="modal-body">
							<p id="tokenModBody">
								</p>

							</div>
                            <a className="btn btn-success btn-sm" download='secret.key' id="tokenFile" type="button" onClick={this.handleClick.bind(this, 'downloadToken')}><i className="fa fa-save"></i> Download Token</a>

							<div className="modal-footer">

								<button type="button" className="btn btn-default" onClick={this.handleClick.bind(this, 'Ok')}>Close</button>
							</div>
						</div>
					</div>
				</div>
				);
		}

	});
});