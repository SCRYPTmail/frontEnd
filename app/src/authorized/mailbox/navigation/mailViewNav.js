define(['react','app','accounting'], function (React,app,accounting) {
	return React.createClass({
		getInitialState : function() {
			return {
				moveFolderMain:[],
				moveFolderCust:[],
                checkNewMails:false,
                trashStatus:false,
                spamStatus:false,
                pastDue:false,
                balanceShort:false

			}
		},
		handleClick: function(i,event) {
			switch(i) {
				case 'email':
				    break;

                case 'checkNewMail':
                    app.mailMan.startShift();

                    break;
                case 'detectDirection':
                    app.layout.detectDirection();

                    break;

                case 'gotoBalance':

                    Backbone.history.navigate("settings/Plan", {
                        trigger : true
                    });

                    break;


			}
		},
        getSelected:function(){
            var selected = [];

            selected=Object.keys(app.user.get("selectedEmails"));

            if(selected.length==0){
                var elem = {};
                var item=$('#emailListTable tr.selected').attr('id');
                if(item!=undefined){
                    selected.push(item);
                }

            }
            return selected;
        },

		handleChange:function(i,event){
			switch(i) {
				case 'moveToFolder':

					var destFolderId=$(event.target).attr('id');

                    var selected=this.getSelected();

					if(selected.length>0){
						app.user.set({"currentMessageView":{}});

						app.globalF.move2Folder(destFolderId,selected,function(){
							app.userObjects.updateObjects('folderUpdate','',function(result){
                                $('#selectAll>input').prop("checked",false);
                                app.user.set({"resetSelectedItems":true});
                                app.globalF.syncUpdates();

							});
						});



					}else{
						app.notifications.systemMessage('selectMsg');
					}


					break;
				case 'moveToTrash':

                    var thisComp=this;
                    this.setState({
                        trashStatus:true
                    });
                    var target={};
                    if($(event.target).is('i')){
                        target=$(event.target)
                    }else{
                        target=$(event.target).find('i')
                    }

                    target.removeClass('fa-trash-o').addClass('fa-refresh fa-spin');

					if(this.props.folderId==app.user.get('systemFolders')['spamFolderId'] ||
						this.props.folderId==app.user.get('systemFolders')['trashFolderId'] ||
						this.props.folderId==app.user.get('systemFolders')['draftFolderId']){

                        var selected=this.getSelected();


                        if(selected.length>0){
                            //console.log(selected);
                           //delete email physically;
                            app.user.set({"currentMessageView":{}});

                                app.globalF.deleteEmailsFromFolder(selected,function(emails2Delete){
                                    //console.log(emails2Delete);
                                    if(emails2Delete.length>0){
                                        app.userObjects.updateObjects('deleteEmail',emails2Delete,function(result){
                                            $('#selectAll>input').prop("checked",false);
                                            app.user.set({"resetSelectedItems":true});
                                            app.globalF.syncUpdates();
                                            app.layout.display('viewBox');

                                            target.removeClass('fa-refresh fa-spin').addClass('fa-trash-o');

                                            thisComp.setState({
                                                trashStatus:false
                                            });

                                        });
                                    }

                                });


                        }else{
                            app.notifications.systemMessage('selectMsg');
                            target.removeClass('fa-refresh fa-spin').addClass('fa-trash-o');
                            thisComp.setState({
                                trashStatus:false
                            });
                        }

					}else{

						var destFolderId=app.user.get("systemFolders")['trashFolderId'];
                        var selected=this.getSelected();


						if(selected.length>0){
							app.user.set({"currentMessageView":{}});
							app.globalF.move2Folder(destFolderId,selected,function(){
								app.userObjects.updateObjects('folderUpdate','',function(result){
                                    $('#selectAll>input').prop("checked",false);
                                    app.user.set({"resetSelectedItems":true});
                                    app.globalF.syncUpdates();
                                    app.layout.display('viewBox');

                                    target.removeClass('fa-refresh fa-spin').addClass('fa-trash-o');

                                    thisComp.setState({
                                        trashStatus:false
                                    });

								});
							});

						}else{
							app.notifications.systemMessage('selectMsg');
                            target.removeClass('fa-refresh fa-spin').addClass('fa-trash-o');
                            thisComp.setState({
                                trashStatus:false
                            });
						}
					}

					break;
				case 'moveToSpam':
                   // console.log('move to spam');

                    var thisComp=this;

                    thisComp.setState({
                        spamStatus:true
                    });
                    var target={};

                    if($(event.target).is('i')){
                        target=$(event.target)
                    }else{
                        target=$(event.target).find('i')
                    }

                    target.addClass('fa-spin');

					var destFolderId=app.user.get("systemFolders")['spamFolderId'];
                    var selected=this.getSelected();


                    if(selected.length>0){
						app.user.set({"currentMessageView":{}});
						app.globalF.move2Folder(destFolderId,selected,function(){

                            $.each(selected, function( index, emailId ) {
								var email=app.transform.from64str(app.user.get('emails')['messages'][emailId]['fr'])
								app.globalF.createFilterRule("","sender","strict", destFolderId, app.globalF.parseEmail(email)['email'],function(){

								});
							});

							app.userObjects.updateObjects('folderSettings','',function(result){
                                if(result['response']=='success' && result['data']=='saved'){
                                    $('#selectAll>input').prop("checked",false);
                                    app.user.set({"resetSelectedItems":true});
                                    app.globalF.syncUpdates();
                                    app.layout.display('viewBox');

                                    target.removeClass('fa-spin');

                                    thisComp.setState({
                                        spamStatus:false
                                    });
                                }

							});
						});



					}else{
						app.notifications.systemMessage('selectMsg');
                        target.removeClass('fa-spin');

                        thisComp.setState({
                            spamStatus:false
                        });
					}

					break;

				case 'markAsRead':

                    var selected=this.getSelected();

					if(selected.length>0){
						var messages=app.user.get('emails')['messages'];
						//var folders=app.user.get('emails')['folders'];

						$.each(selected, function( index, emailId ) {

							//folders[messages[emailId]['f']][emailId]['st']==0?folders[messages[emailId]['f']][emailId]['st']=3:folders[messages[emailId]['f']][emailId]['st'];
							messages[emailId]['st']==0?messages[emailId]['st']=3:messages[emailId]['st'];

						});


						app.userObjects.updateObjects('folderUpdate','',function(result){
                            $('#selectAll>input').prop("checked",false);
                            app.user.set({"resetSelectedItems":true});
                            app.globalF.syncUpdates();
						});

						//app.userObjects.saveMailBox('emailsRead',{});
					}else{
						app.notifications.systemMessage('selectMsg');
					}

					break;

				case 'markAsUnread':

                    var selected=this.getSelected();

					if(selected.length>0){
						var messages=app.user.get('emails')['messages'];
						//var folders=app.user.get('emails')['folders'];

						$.each(selected, function( index, emailId ) {

							//folders[messages[emailId]['f']][emailId]['st']=0;
							messages[emailId]['st']=0;

						});


						app.userObjects.updateObjects('folderUpdate','',function(result){
                            $('#selectAll>input').prop("checked",false);
                            app.user.set({"resetSelectedItems":true});
                            app.globalF.syncUpdates();
						});

						//app.userObjects.saveMailBox('emailsRead',{});
					}else{
						app.notifications.systemMessage('selectMsg');
					}

					break;


			}
		},

		change: function(event){

		//console.log(event.target.value);
			$('#emailListTable').DataTable().column( 0 ).search(
				event.target.value,
				0,
				1
			).draw();
		},

		componentWillUnmount: function () {
			app.user.off("change:mailboxSize");
            app.user.off("change:checkNewEmails");
            app.user.off("change:pastDue");
            app.user.off("change:balanceShort");



		},
		componentDidMount: function() {
			//this.getMainFolderList();
			//$( document ).tooltip();
            //$("[rel=tooltip]").tooltip();

			//this.getCustomFolderList();
			this.getMainFolderList();
			this.getCustomFolderList();
			var thisComp=this;

			app.user.on("change:mailboxSize",function() {
				thisComp.forceUpdate();
			});

            app.user.on("change:checkNewEmails",function() {

                thisComp.setState({
                    checkNewMails:app.user.get('checkNewEmails')

                });
                //console.log(thisComp.state.checkNewMails);
            });
            thisComp.checkPastDue();

            app.user.on("change:pastDue",function() {thisComp.checkPastDue()},thisComp);
            app.user.on("change:balanceShort",function() {thisComp.checkPastDue()},thisComp);

		},

        checkPastDue:function(){
           // console.log(app.user.get('pastDue'));
            this.setState({
                pastDue:app.user.get('pastDue'),
                balanceShort:app.user.get('balanceShort')
            });

        },

		getMainFolderList:function(){
			var mainFolderList=app.globalF.getMainFolderList();
			var thisComp=this;

			var options = [];
			$.each(mainFolderList, function( index, folderData ) {

				if(['Inbox','Spam','Trash'].indexOf(folderData['role']) > -1){
					options.push(
						<li key={folderData['index']}>
							<a  id={folderData['index']} onClick={thisComp.handleChange.bind(thisComp, 'moveToFolder')}>{folderData['name']}</a>
						</li>
					);

				}
			});

			this.setState({
				moveFolderMain:options
			});
			//return options;
		},

		boxSize:function(){

			//console.log(app.globalF.countEmailsSize());
			return (
				<span className="mailboxsize">

				{accounting.toFixed(app.user.get("mailboxSize")/1024/1024,2)} MB
				&nbsp;/&nbsp;
					<strong>{app.user.get("userPlan")['planData']['bSize']} MB</strong>
				</span>
				)
		},

		getCustomFolderList:function(){

			var folderList=app.globalF.getCustomFolderList();
			var thisComp=this;

			var options = [];
			$.each(folderList, function( index, folderData ) {
				options.push(
					<li key={index}>
						<a  id={folderData['index']} onClick={thisComp.handleChange.bind(thisComp, 'moveToFolder')}>{folderData['name']}</a>
					</li>
				);
			});
			this.setState({
				moveFolderCust:options
			});

		},

		render: function () {

			var st1={height:'25px',marginLeft:'4px',marginBottom:'2px'};
			var st2={marginTop:'3px'};
			var st3={width:'30px'};

            var balanceShort=[];
            if(this.state.balanceShort && !this.state.pastDue){
                var balance=app.user.get("userPlan")['balance'];
                var monthlyCharge=app.user.get("userPlan")['monthlyCharge'];
               // var planDue=new Date(parseInt(app.user.get("userPlan")['cycleEnd']+'000')).toLocaleDateString();

                balanceShort.push(
                    <button key="shrt1"
                        className={"btn btn-default btn-warning"}
                            data-placement="bottom" data-toggle="popover-hover"
                            data-html="true"
                        title=""
                            data-content={"Your subscription will be renewed in less than <b>7 days</b>. <br/>Your monthly plan higher than your available balance by <b>"+accounting.formatMoney(monthlyCharge-balance)+"</b> <br/>To prevent service interruption please refill your balance."} type="button"

                            onClick={this.handleClick.bind(this, 'gotoBalance')}>
                        <i key="shrt2" className="fa fa-bell-o fa-lg txt-color-white"></i>

                    </button>
                );
            }
		return (
			<div className="emailHeader col-xs-12">

				<div className="leftFolderAndSpace">
					<div className="inbox-space visible-md visible-sm visible-lg pull-left InboxRefresh">

					{this.boxSize()}

						<img src="img/logo/logo.png" alt="emails per account" style={st1}/>
						<button className="btn btn-default pull-right" rel="tooltip" title="" data-placement="bottom" data-original-title="Check new email" type="button" onClick={this.handleClick.bind(this, 'checkNewMail')} disabled={this.state.checkNewMails}><i className={"fa fa-refresh fa-lg "+(this.state.checkNewMails?"fa-spin":"")}></i></button>

						<div className="progress progress-xs">
							<div className="progress-bar progress-primary" style={st3}></div>
							</div>
							</div>



						</div>
						<div className="InboxIcons">

							<div className="btn-group pull-left hidden-xs">
								<div className="form-group">
									<input type="text" className="form-control" placeholder="Search"  onChange={this.change} />
								</div>
							</div>


							<div className="mailIcons">
								<button className="btn btn-default visible-xs pull-left" data-placement="bottom" data-toggle="popover-hover"  title="" data-content="Back To Email" type="button" onClick={this.handleClick.bind(this, 'detectDirection')}>
									<i id="navArrow" className="navArrow fa fa-long-arrow-left fa-lg"></i>
								</button>


								<div className="btn-group">
									<button className="btn btn-default" id="mvFolderButton" data-toggle="dropdown" data-placement="top" data-toggle="dropdown"  title="" data-content="Move To Folder" type="button" onclick="">
										<i className="fa fa-folder-open-o fa-lg"></i> <i className="fa fa-angle-down fa-lg"></i>
									</button>


									<ul id="mvtofolder" className="dropdown-menu scrollable-menu" role="menu">
											{this.state.moveFolderMain}
										<li className="divider"></li>
											{this.state.moveFolderCust}
									</ul>

								</div>

								<button className="btn btn-default deletebutton" data-placement="bottom" data-toggle="popover-hover"  title="" data-content="Trash" type="button" disabled={this.state.trashStatus}
								onClick={this.handleChange.bind(this, 'moveToTrash')}>
									<i className="fa fa-trash-o fa-lg"></i>
								</button>

								<button className="btn btn-default" data-placement="bottom" data-toggle="popover-hover"  title="" data-content="Spam" type="button"
                                        disabled={this.state.spamStatus}
                                        onClick={this.handleChange.bind(this, 'moveToSpam')}>
									<i className="fa fa-ban fa-lg"></i>
								</button>


								<div className="btn-group boxEmailOption" >
									<button className="btn btn-default dropdown-toggle" data-toggle="dropdown" >
									More <i className="fa fa-angle-down fa-lg"></i>
									</button>
									<ul className="dropdown-menu pull-right">
										<li id="replythis">
											<a onClick={this.handleChange.bind(this, 'markAsRead')}>Mark as read</a>

										</li>
										<li id="forwardthis">
											<a onClick={this.handleChange.bind(this, 'markAsUnread')}>Mark as unread</a>
										</li>

									</ul>

								</div>

                                {balanceShort}
                                <button className={"btn btn-default "+(this.state.pastDue?"back_red":"hidden")} data-placement="bottom" data-toggle="popover-hover"  title="" data-content="Account is past due. Please refill your balance." type="button"

                                        onClick={this.handleClick.bind(this, 'gotoBalance')}>
                                    <i className="fa fa-bell-o fa-lg txt-color-white"></i>
                                </button>

								<button className="btn btn-sm btn-default w-xxs w-auto-xs hidden" tooltip="Archive"><i className="ion ion-archive ion-lg"></i></button>

							</div>
						</div>
					</div>
			);
		}

	});
});
