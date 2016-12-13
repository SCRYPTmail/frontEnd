define(['react','app'], function (React,app) {
	return React.createClass({
		getInitialState : function() {
			return {

				mainFolders:app.globalF.getMainFolderList(),
                customFolders:app.globalF.getCustomFolderList(),
				moveFolderMain:[],
				moveFolderCust:[],
                unopened:app.user.get('unopenedEmails'),
			}
		},
		componentDidMount: function() {
			//this.getMainFolderList();
			//$( document ).tooltip();
            var thisComp=this;

            thisComp.props.changeFodlerId(app.user.get('systemFolders')['inboxFolderId']);


			//console.log(this.props.activePage)
          //  console.log(thisComp.state.unopened);
			//this.getCustomFolderList();
			//this.getMainFolderList();

            app.user.on("change:unopenedEmails",function() {
                thisComp.updateUnopened();
            });
		},
        componentWillUnmount: function () {
            app.user.off("change:unopenedEmails");
        },

        updateUnopened:function(){
            var thisComp=this;
            this.setState({
                unopened:app.user.get('unopenedEmails'),
            });
        },

		removeClassesActive:function(){
			$('#folderul>li').removeClass('active');
			$('#folderulcustom>li').removeClass('active');

		},

		handleChange:function(i,event){
			switch(i) {
				case 'switchFolder':
					var thisComp=this;
                    
                    clearTimeout(app.user.get('emailOpenTimeOut'));

					app.mixins.canNavigate(function(decision){
						if(decision){
                          //  console.log($(event.target).attr('id'));

							var folder=app.user.get('folders')[$(event.target).attr('id')]['name'];
							thisComp.removeClassesActive();
							$(event.target).parents('li').addClass('active');
							//console.log($(event.target).attr('id'));

							Backbone.history.navigate("/mail/"+app.transform.from64str(folder), {
								trigger : true
							});
							app.user.set({"resetSelectedItems":true});

							app.globalF.resetCurrentMessage();
							app.globalF.resetDraftMessage();

							thisComp.props.changeFodlerId($(event.target).attr('id'));


                            $('#mMiddlePanel').scrollTop(0);
                            $('#selectAll>input').prop("checked",false);

                            app.layout.display('viewBox');

						}
					});


					break;
			}
		},

		handleClick: function(i) {
			switch(i) {


				case 'composeEmail':
					app.mixins.canNavigate(function(decision){
							if(decision){

								$('#emailListTable').find("tr").removeClass("selected");

								Backbone.history.navigate("/mail/Compose", {
									trigger : true
								});
							}
					});


					break;


				case 'addFolder':
					app.mixins.canNavigate(function(decision){
						if(decision){
							Backbone.history.navigate("/settings/Folders", {
								trigger : true
							});
						}
					});


					break;

				case 'login':
					//console.log
					console.log(createUserFormValidator);
				break;
			}


		},
		render: function () {
			//console.log(this.props.activePage);

		return (
			<div className={this.props.panel.leftPanel} id="mLeftPanel">

				<div className="folder-nav">

					<div>
						<a href="javascript:void(0);" id="compose-mail" className="btn btn-primary btn-block" onClick={this.handleClick.bind(this, 'composeEmail')}>
							<strong>Compose</strong> </a>

						<h6> </h6>

						<ul className="inbox-menu-lg" id="folderul">

                            {
                                Object.keys(this.state.mainFolders).map(function (folderData, i) {
                                   // console.log(this.state.mainFolders[folderData]['index']);
                                    //console.log(this.state.mainFolders[folderData]['name']);
                                    return (
                                        <li key={"liM_"+this.state.mainFolders[folderData]['index']}
                                            className={
                                            "pull-left "+(
                                                this.state.mainFolders[folderData]['role']=='Inbox'?"active":(
                                                    this.state.unopened[this.state.mainFolders[folderData]['index']]==0?"":"bold"
                                                    )
                                                )
                                            }>
                                            <a key={"aM_"+i}
                                               className="col-xs-9"
                                               id={this.state.mainFolders[folderData]['index']}
                                               onClick={this.handleChange.bind(this, 'switchFolder')}
                                               data-name={this.state.mainFolders[folderData]['name']}>
                                                {this.state.mainFolders[folderData]['name']+" "+
                                                    (this.state.unopened[this.state.mainFolders[folderData]['index']]==0 ||
                                                        this.state.mainFolders[folderData]['index']==app.user.get('systemFolders')['sentFolderId']||
                                                        this.state.mainFolders[folderData]['index']==app.user.get('systemFolders')['trashFolderId']
                                                    ?"":"("+this.state.unopened[this.state.mainFolders[folderData]['index']]+")")
                                                }

                                            </a>

                                            <span key={"spM_"+i}
                                                  className="pull-right bg-color-blueLight">
                                            </span>
                                        </li>);

                                },this)
                            }

						</ul>

						<h6> Folders <a rel="tooltip" title="Add Folder" className="pull-right txt-color-darken">
							<i className="fa fa-plus" onClick={this.handleClick.bind(this, 'addFolder')}></i></a>
						</h6>

						<ul className="inbox-menu-lg" id="folderulcustom">

                            {
                                this.state.customFolders.map(function (folderData, i) {
                                    //console.log(folderData['index']);
                                    //console.log(folderData['name']);

                                    return (
                                        <li key={"li_"+folderData['index']}
                                            className={"pull-left "+(folderData['role']=='Inbox'?"active":(this.state.unopened[folderData['index']]==0?"":"bold"))}>
                                            <a key={"a_"+i} className="col-xs-9" id={folderData['index']}
                                               onClick={this.handleChange.bind(this, 'switchFolder')}>
                                                {folderData['name']+" "+
                                                (this.state.unopened[folderData['index']]==0?"":"("+this.state.unopened[folderData['index']]+")"
                                                )
                                                }

                                            </a>

                                            <span key={"sp_"+i}
                                                  className="badge pull-right bg-color-blueLight">

                                            </span>
                                        </li>);

                                },this)
                            }

						</ul>
					</div>

				</div>


			</div>
			);
		}

	});

});