/**
 * Author: Sergei Krutov
 * Date: 10/31/15
 * For: SCRYPTmail.com.
 * Version: RC 0.99
 */

define(['react','app'], function (React,app) {
	return React.createClass({

		componentDidMount: function() {
			$('#dialogPop').on('hide.bs.modal', function (event) {
				$('#dialogOk').off('click');
			});

		},

        /**
         *
         * @param {string} action
         * @param {object} event
         */
		handleClick: function(action,event) {
			switch(action) {
				case 'cancel':
					$('#dialogPop').modal('hide');
					break;
			}
		},

        /**
         *
         * @returns {JSX}
         */
		render: function () {
			return (
				<div className="modal fade" id="dialogPop">
					<div className="modal-dialog">
						<div className="modal-content">
							<div className="modal-header">
								<h4 className="modal-title" id="dialogModHead"></h4>
							</div>
							<div className="modal-body">
								<p id="dialogModBody">
								</p>

							</div>
							<div className="modal-footer">
								<button type="button" className="btn btn-primary" id="dialogOk">OK</button>
								<button type="button" className="btn btn-default" id="dialogCancel" onClick={this.handleClick.bind(this, 'cancel')}>Cancel</button>
							</div>
						</div>
					</div>
				</div>
				);
		}

	});
});