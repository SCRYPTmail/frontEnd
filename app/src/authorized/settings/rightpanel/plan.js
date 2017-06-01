define(['react', 'app','accounting','jsui'], function (React, app,accounting,jsui) {
	return React.createClass({
		getInitialState: function () {
			return {

				firstPanelClass: "panel-body",
				firstTab: "active",

				secondTab:"",
				secondPanelClass:"panel-body hidden",

				detailVisible: "",
				detailButtonVisible: "",
				//editDisabled:true,
				editDisabled: true,

				editPlanButtonClass:"",
				saveButtonClass:"hidden",

				mobileViewClass: "visible-xs",
				desktopViewClass: "hidden-xs",

				cancelEditClass:"hidden",


				boxSize: 0,
                newboxSize:0,

                cDomain: 0,
                newcDomain:0,

                aliases: 0,
                newaliases:0,

				dispEmails:0,
                newdispEmails:0,

                newpgpStrength:0,
				pgpStrength: 0,

                attSize: 0,
                newattSize:0,

				importPGP: 0,
                newimportPGP:0,

				contacts: 0,
                newcontacts: 0,

				delaySend: 0,
                newdelaySend: 0,

				sendLimits: 0,
                newsendLimits: 0,

                recipPerMail:0,
                newrecipPerMail:0,

				folderExpiration: 0,
                newfolderExpiration: 0,

				secLog: 0,
                newsecLog: 0,

				filtEmail: 0,
                newfiltEmail: 0,

				currentServiceCost:0,

				paidThisMonth:0,
				outstandingBalance:0,
				balance:0,
				cycleStart:'',
				cycleEnd:'',
				monthlyCharge:0,
                claimAmount:0,
                isAlrdClaimed:false,

				bitcoinPay:"hidden",
				paypalPay:"hidden",
				monthChargeClass:"hidden",
                planSelector:1,
                paymentVersion:0,
                currentPlan:0




			};

		},

		handleClick: function (i) {
			switch (i) {

                case 'claimFree':
                    var thisComp=this;

                    var post={};
                    app.serverCall.ajaxRequest('claimFree', post, function (result) {
                        if (result['response'] == "success") {
                            app.notifications.systemMessage('saved');
                            thisComp.handl
                            app.userObjects.loadUserPlan(function(){});
                            thisComp.setState({
                                isAlrdClaimed:true
                            });

                            thisComp.handleClick('showFirst');
                        }else if(result['response']==='fail' && result['data']==='alrdUsed') {
                            app.notifications.systemMessage('alrdUsed');
                        }

                    });


                    break;

				case 'showFirst':

					this.setState(
						{
							firstPanelClass: "panel-body",
							firstTab: "active",

							secondTab:"",
							secondPanelClass:"panel-body hidden",

							editDisabled: true,
							cancelEditClass:"hidden",

							editPlanButtonClass:"",
							saveButtonClass:"hidden"

						});

					$(".normal-slider").slider({disabled: true});
					break;

				case 'showSecond':
					this.setState(
						{
							firstPanelClass: "panel-body hidden",
							firstTab: "",

							secondTab:"active",
							secondPanelClass:"panel-body"
						});
					break;

				case 'showDetail':
					this.setState(
						{
							detailVisible: "",
							detailButtonVisible: "hidden"
							//firstPanelClass:"panel-body hidden",
							//secondPanelClass:"panel-body"
						});
					break;

				case 'editPlan':
					$(".normal-slider").slider({disabled: false});
					this.setState({
						editDisabled: false,
						cancelEditClass:"",
						editPlanButtonClass:"hidden",
						saveButtonClass:""
					});

					//console.log(this.state.pricing)

					break;
				case 'pay':
					//$('#bitcoinModal').modal('show');

					break;

				case 'cancelEdit':
                    var thisComp=this;
                    thisComp.setState({
                        planSelector: thisComp.state.currentPlan,
                    },function(){
                        thisComp.calculateNewPrice();
                    });

					this.handleClick('showFirst');

					break;
				case 'savePlan':
					var thisComp=this;

					var post=this.getPlansDataPost();
					app.serverCall.ajaxRequest('savePlan', post, function (result) {
							if (result['response'] == "success") {
								app.notifications.systemMessage('saved');
								thisComp.handleClick('showFirst');

                                thisComp.presetValues();

							}else if(result['response'] == "fail" && result['data']=="insBal"){

								$('#infoModHead').html("Insufficient Funds");
								$('#infoModBody').html("You are over your available balance by: <b>$"+result['need']+"</b> <br/>Please add more funds or select different plan.");
								$('#infoModal').modal('show');

							}else if(result['response'] == "fail" && result['data']=="failToSave"){
								app.notifications.systemMessage('tryAgain');
							}
					});
								break;


			}


		},

		getPlansDataPost: function(){

			var post={
				'userId':app.user.get('userId'),
                'planSelector':this.state.planSelector
			}
			return post;
		},

		handleChange: function (i, event) {
			var thisComp=this;
			switch (i) {
                case "changeBoxSize":

                    if(thisComp.state.currentPlan!==77 && event.target.value==77){
                        $('#infoModHead').html("Need More Features?");
                        $('#infoModBody').html("If you need more features than our existing plans can offer, please contact: <b>support@scryptmail.com</b>, put 'Custom Plan Request' in subject line and we will be happy to discuss our custom pricing options.<br/> Thank you");
                        $('#infoModal').modal('show');

                    }else{
                        thisComp.setState({
                            planSelector: event.target.value,
                        },function(){
                            this.calculateNewPrice();
                        });
                    }


                    break;

				case "changePayment":
					var targVal=event.target.value;
                    var post={
                        'userId':app.user.get('userId'),
                        'planSelector':this.state.planSelector
                    }

					if(targVal=='bit'){

						app.serverCall.ajaxRequest('createOrderBitcoin', post, function (result) {
							if (result['response'] == "success") {

								thisComp.setState({
										paymentType: targVal,
										bitcoinLink:"https://www.coinbase.com/checkouts/"+result['data']['embed_code'],
										bitcoinPay:"",
										paypalPay:"hidden"
									});
							}
						});
					}else if(targVal=='paypal'){

						thisComp.setState({
							paymentType: targVal,
							paypalPay:"",
							bitcoinPay:"hidden"

						});

					}else{
						thisComp.setState({
							paymentType: targVal,
							bitcoinPay:"hidden",
							paypalPay:"hidden"
						});
					}

					break;
					this.calculateNewPrice();
			}

		},

		componentWillUnmount: function () {
			app.user.off("change:userPlan");
		},
		calculateNewPrice: function () {
			var thisComp=this;
			var post=this.getPlansDataPost();

			app.serverCall.ajaxRequest('calculatePrice', post, function (result) {
				if (result['response'] == "success") {

					var paid =thisComp.state.paidThisMonth;
					var outstanding=result['data']['currentCost']-paid;
                    var newPlan=result['data']['plan'];
					thisComp.setState({
						outstandingBalance:outstanding>0?outstanding:0,
						monthlyCharge:result['data']['monthlyCharge'],
						currentServiceCost:result['data']['currentCost'],
                        newboxSize:newPlan['bSize'],
                        newcDomain:newPlan['cDomain'],
                        newaliases:newPlan['alias'],
                        newpgpStrength:newPlan['pgpStr'],
                        newattSize:newPlan['attSize'],
                        newdispEmails:newPlan['dispos'],

                        newimportPGP:newPlan['pgpImport'],
                        newcontacts: newPlan['contactList'],
                        newdelaySend: newPlan['delaySend'],
                        newsendLimits: newPlan['sendLimits'],
                        newrecipPerMail:newPlan['recipPerMail'],
                        newfolderExpiration: newPlan['folderExpire'],
                        newsecLog: newPlan['secLog'],
                        newfiltEmail: newPlan['filter'],

					});
					if(result['data']['monthlyCharge']!=app.user.get("userPlan")['monthlyCharge']){
						thisComp.setState({
							monthChargeClass:""
						});
					}



				}
			});


		},

        presetValues:function(){

            var thisComp = this;

            var def=$.Deferred();

            app.userObjects.loadUserPlan(function(){
                def.resolve();
            });


            def.done(function(){

                var currentPlan=app.user.get("userPlan");
                var decodedPlan=currentPlan['planData'];

                var timeEnd=new Date(currentPlan['cycleEnd']*1000);
                var dateStarted=new Date(currentPlan['created']*1000).getTime();
                var goodOld=new Date(2015, 11, 19).getTime();

                var amount=2;
                if(goodOld>dateStarted){
                    amount=5;
                }

                if(currentPlan['paymentVersion']===1){
                  if( currentPlan['monthlyCharge']===0){
                          thisComp.setState({
                              planSelector:0,
                              paymentVersion:1
                          });
                      }else{
                      thisComp.setState({
                          planSelector:77,
                          paymentVersion:currentPlan['paymentVersion'],
                          currentPlan:77
                      });
                  }
                }if(currentPlan['paymentVersion']===2){
                    thisComp.setState({
                        planSelector:currentPlan['planSelected'],
                        paymentVersion:2,
                        currentPlan:currentPlan['planSelected']
                    });
                }



                thisComp.setState({

                    boxSize: decodedPlan['bSize'],
                    cDomain: decodedPlan['cDomain'],
                    aliases: decodedPlan['alias'],
                    dispEmails: decodedPlan['dispos'],

                    pgpStrength: decodedPlan['pgpStr'],
                    attSize: decodedPlan['attSize'],
                    importPGP: decodedPlan['pgpImport'],
                    contacts: decodedPlan['contactList'],
                    delaySend: decodedPlan['delaySend'],
                    sendLimits: decodedPlan['sendLimits'],
                    recipPerMail:decodedPlan['recipPerMail'],
                    folderExpiration: decodedPlan['folderExpire'],
                    secLog: decodedPlan['secLog'],
                    filtEmail: decodedPlan['filter'],
                    claimAmount:amount,
                    //isAlrdClaimed:currentPlan['creditUsed'],
					isAlrdClaimed:true,

                    cycleEnd:timeEnd.toLocaleDateString()
                });

                setTimeout(function(){
                    thisComp.calculateNewPrice();
                },100);


            });
        },

		componentDidMount: function () {

            this.presetValues();

            app.user.on("change:userPlan",function() {this.forceUpdate()},this);

		},

        componentWillUnmount: function () {
            app.user.off("change:userPlan");

        },

        planOptions:function(){
            var planOptions=[];

            if(this.state.paymentVersion===1){
                planOptions.push(
                    <option key="opt0" value="0">Free Plan Will Expire (July 10, 2017)</option>
                );
            }

            planOptions.push(
                <option key="opt1" value="1">Basic - $2/month</option>
            );
            planOptions.push(
                <option key="opt7" value="7">Advanced - $7/month</option>
            );
            planOptions.push(
                <option key="opt15" value="15">Premium - $15/month</option>
            );
            planOptions.push(
                <option key="opt77" value="77">Custom Plan</option>
            );

            return planOptions;
        },
		accountDataTable: function () {

            var options = [];

            var paid=[];
            if(app.user.get("userPlan")['balance']<0){
                paid.push(<span key="sd1" className='txt-color-red'>{accounting.formatMoney(app.user.get("userPlan")['balance'])}</span>);
                paid.push( <span  key="sd2"  className="pull-right txt-color-red">Account is past due.</span>);
            }else{
                paid.push(<span key="sd1" className=''>{accounting.formatMoney(app.user.get("userPlan")['balance'])}</span>);
            }
           //

			options.push(<tr key="1">
				<td className="col-xs-6">
					<b>Available Balance:</b>
				</td>
				<td className="col-xs-6">{paid}

					<span className={"badge pull-right "+this.state.monthChargeClass}>
					{this.state.currentServiceCost>app.user.get("userPlan")['alrdPaid']?
						app.user.get("userPlan")['balance']-(this.state.currentServiceCost-app.user.get("userPlan")['alrdPaid'])>=0?accounting.formatMoney(app.user.get("userPlan")['balance']-(this.state.currentServiceCost-app.user.get("userPlan")['alrdPaid'])):"Insufficient Balance":""

						}
				</span>

				</td>

			</tr>);

			options.push(<tr key="1a">
				<td className="col-xs-6">
					<b>Prorated Cost:</b><br/>
				(End of the cycle)
				</td>
				<td className="col-xs-6">{accounting.formatMoney(this.state.currentServiceCost)}</td>
			</tr>);


			options.push(<tr key="2">
				<td>
					<b>Paid this Cycle:</b>
				</td>
				<td>{accounting.formatMoney(app.user.get("userPlan")['alrdPaid'])}

				</td>
			</tr>);

			options.push(<tr key="2a">
				<td>
					<b>Next Cycle Estimate:</b>
				</td>
				<td>{accounting.formatMoney(app.user.get("userPlan")['monthlyCharge'])}
					<span className={"badge pull-right "+this.state.monthChargeClass}>
				{accounting.formatMoney(this.state.monthlyCharge)}</span></td>
			</tr>);
			options.push(<tr key="3">
				<td>
					<b>Next Billing:</b>
				</td>
				<td>{this.state.cycleEnd}</td>
			</tr>);

			return options;

		},
		planTable: function () {
			var options = [];

			//Mailbox Size
            var boxDif="";
            var bxS=this.state.newboxSize;

            if(this.state.newboxSize!=this.state.boxSize){
                boxDif=" => "+(bxS>1000?bxS/1000+" Gb":bxS+" MB");
            }
			options.push(<tr key="1">
				<td className="col-xs-5 no-right-padding">
					<b>Mailbox Size:</b>
				</td>
				<td className="col-xs-7">
                    {(this.state.boxSize>1000?this.state.boxSize/1000+" Gb":this.state.boxSize+" MB")}
                    &nbsp;<b>{boxDif}</b>
				</td>
			</tr>);

            var domDif ="";
            if(this.state.newcDomain!=this.state.cDomain) {
                var domDif = " => " + this.state.newcDomain;
            }


			options.push(<tr key="2" className="">
				<td className="col-xs-5 no-right-padding">
					<b>Custom Domain:</b>
				</td>
				<td className="col-xs-7">
                    {this.state.cDomain}
                    &nbsp;<b>{domDif}</b>
                </td>
			</tr>);

            var alDif ="";
            if(this.state.newaliases!=this.state.aliases) {
                var alDif = " => " + this.state.newaliases;
            }
			options.push(<tr key="3" className="">
				<td className="col-xs-5">
					<b>Email Aliases:</b>
				</td>
				<td>
                    {this.state.aliases}
                    &nbsp;<b>{alDif}</b>
				</td>
			</tr>);

            var pgpStrengthDif="";
            if(this.state.newpgpStrength!=this.state.pgpStrength) {
                var pgpStrengthDif = " => " + this.state.newpgpStrength + "  bit";
            }
			options.push(<tr key="4" className="">
				<td className="col-xs-5 no-right-padding">
					<b>PGP Key Strength:</b>
				</td>
				<td>
                    {this.state.pgpStrength} bit
                    &nbsp;<b>{pgpStrengthDif}</b>
				</td>
			</tr>);

            var attSizeDif="";
            if(this.state.newattSize!=this.state.attSize){
                attSizeDif=" => "+this.state.newattSize+" Mb";
            }

			options.push(<tr key="5" className="">
				<td>
					<b>Attachment Size:</b>
				</td>
				<td>
                    {this.state.attSize} Mb
                    &nbsp;<b>{attSizeDif}</b>
				</td>
			</tr>);

            var disemailDif="";
            if(this.state.newdispEmails!=this.state.dispEmails){
                disemailDif=" => "+this.state.newdispEmails;
            }

            options.push(<tr key="7" className={this.state.detailVisible}>
				<td>
					<b>Disposable Emails:</b>
				</td>
				<td>
                    {this.state.dispEmails}
                    &nbsp;<b>{disemailDif}</b>
				</td>
			</tr>);


            var contDif="";
            if(this.state.newcontacts!=this.state.contacts){
                contDif=" => "+this.state.newcontacts+" contacts";
            }

			options.push(<tr key="9" className={this.state.detailVisible}>
				<td>
					<b>Address Book:</b>
				</td>
				<td>
                    {this.state.contacts} contacts
                    &nbsp;<b>{contDif}</b>
				</td>
			</tr>);

			options.push(<tr key="10" className={this.state.detailVisible+" hidden"}>
				<td>
					<b>Scheduled Sending:</b>
				</td>
				<td>
					<span className={this.state.desktopViewClass}>{this.state.delaySend == 0 ? "No" : "Yes"}</span>

					<span className={"col-xs-12 " + this.state.mobileViewClass}>
						<div className="form-group">
							<select name="sDelaySend" id="sDelaySend" className="form-control" disabled={this.state.editDisabled} value={this.state.delaySend}
							onChange={this.handleChange.bind(this, 'changeBoxSize')}>
								<option value="0">No</option>
								<option value="1">Yes</option>

							</select>
						</div>
					</span>
					<div className="clearfix"></div>

					<div className={"col-xs-3 normal-slider " + this.state.desktopViewClass} id="delaySend"></div>


				</td>
			</tr>);

            var recipDif="";
            if(this.state.newrecipPerMail!=this.state.recipPerMail){
                recipDif=" => "+this.state.newrecipPerMail+" recipients/email";
            }

            options.push(<tr key="11a" className={this.state.detailVisible}>
                <td>
                    <b>Recipient Per Email:</b>
                </td>
                <td>
                    {this.state.recipPerMail} recipients/email
                    &nbsp;<b>{recipDif}</b>
                </td>
            </tr>);

            var sendEmDif="";
            if(this.state.newsendLimits!=this.state.sendLimits){
                sendEmDif=" => "+this.state.newsendLimits+" emails/hour";
            }

			options.push(<tr key="11" className={this.state.detailVisible}>
				<td>
					<b>Sending Limits:</b>
				</td>
				<td>
                    {this.state.sendLimits} emails/hour
                    &nbsp;<b>{sendEmDif}</b>
				</td>
			</tr>);

            var foldExpDif="";
            if(parseInt(this.state.newfolderExpiration)!==parseInt(this.state.folderExpiration)){
                foldExpDif=" => "+(this.state.newfolderExpiration == 0 ? "No" : "Yes");
            }

			options.push(<tr key="12" className={"freemium "+this.state.detailVisible}>
				<td>
					<b>Folder Expiration: </b><a title="Freemium Feature">
                    <span className="fa-stack">
                      <i className="fa fa-circle fa-stack-1x"></i>
                      <i className="fa fa fa-usd fa-stack-1x fa-inverse"></i>
                    </span>
                    </a>
				</td>
				<td>
                    {
                        this.state.folderExpiration == 0 ? "No" : "Yes"
                    }
                    &nbsp;<b>{foldExpDif}</b>
				</td>
			</tr>);

/*
			options.push(<tr key="13" className={this.state.detailVisible}>
				<td>
					<b>Security Log(free):</b>
				</td>
				<td>
					<span className={this.state.desktopViewClass}>{this.state.secLog == 0 ? "No" : "Yes"}</span>

					<span className={"col-xs-12 " + this.state.mobileViewClass}>
						<div className="form-group">
							<select name="sSecLog" id="sSecLog" className="form-control" disabled={this.state.editDisabled} value={this.state.secLog}
							onChange={this.handleChange.bind(this, 'changeBoxSize')}>
								<option value="0">No</option>
								<option value="1">Yes</option>

							</select>
						</div>
					</span>
					<div className="clearfix"></div>

					<div className={"col-xs-3 normal-slider " + this.state.desktopViewClass} id="secLog"></div>

				</td>
			</tr>);

*/
			options.push(<tr key="16" className={this.state.detailVisible+" hidden"}>
				<td>
					<b>Filter Rules:</b>
				</td>
				<td>
					<span className={this.state.desktopViewClass}>{this.state.filtEmail} rules</span>

					<span className={"col-xs-12 " + this.state.mobileViewClass}>
						<div className="form-group">
							<select name="sFiltEmail" id="sFiltEmail" className="form-control" disabled={this.state.editDisabled} value={this.state.filtEmail}
							onChange={this.handleChange.bind(this, 'changeBoxSize')}>
								<option value="50">50 rules</option>
								<option value="100">100 rules</option>
								<option value="300">300 rules</option>
								<option value="500">500 rules</option>
								<option value="1000">1000 rules</option>
								<option value="3000">3000 rules</option>

							</select>
						</div>
					</span>
					<div className="clearfix"></div>

					<div className={"col-xs-11 normal-slider " + this.state.desktopViewClass} id="filtEmail"></div>

				</td>
			</tr>);

			options.push(<tr key="18">
				<td className="col-xs-6">
					<b>Current Cost:</b>
				</td>
				<td className="col-xs-6">{accounting.formatMoney(this.state.currentServiceCost)}</td>
			</tr>);

			return options;
		},
		render: function () {

            var visib='hidden';
            var email=app.transform.SHA512(app.user.get('email'));
            if(email=="4302aa9f8088d99dd104078283eac1940d2e156af838ba07d18f5f03898080afc378065bdc199779dd7b9296d3d11e0080e7f249108ffbd54093cb53030c8688" || email=="fb38ac6dcd5165030b022088a19366e8a5400a353ef201c239c42ae0910598bdeb7f91e91807c16e46a7a52bd3c8e59c6410a376d927f023fd791b3537dc7893"){
                visib="";
            }
			return (
				<div className={this.props.classes.rightClass} id="rightSettingPanel">

					<div className="col-lg-7 col-xs-12 personal-info ">
						<div className="panel panel-default">
							<div className="panel-heading">
								<ul className="nav nav-tabs tabbed-nav">
									<li role="presentation" className={this.state.firstTab}>
										<a onClick={this.handleClick.bind(this, 'showFirst')}>
											<h3 className={this.props.tabs.Header}>Features</h3>
											<h3 className={this.props.tabs.HeaderXS}>
												<i className="ion-bag"></i>
											</h3>

										</a>
									</li>
									<li role="presentation" className={this.state.secondTab}>
										<a onClick={this.handleClick.bind(this, 'showSecond')}>
											<h3 className={this.props.tabs.Header}>Refill</h3>
											<h3 className={this.props.tabs.HeaderXS}><i className="fa fa-credit-card"></i></h3>
										</a>
									</li>

								</ul>
							</div>

							<div className={this.state.firstPanelClass}>
								<h3 className="pull-left">Account:</h3>
                                <div className="pull-right dialog_buttons">
                                <button type="button" className={"btn btn-primary pull-right "} onClick={this.handleClick.bind(this, 'showSecond')}>Refill</button>

                                <button type="button" className={"btn btn-success pull-right "+(this.state.isAlrdClaimed?"hidden":"")} onClick={this.handleClick.bind(this, 'claimFree')}
                                        data-placement="bottom" data-toggle="popover-hover" data-trigger="focus" title="" data-content={"As our appreciation for using SCRYPTmail, we decided to award you with $"+this.state.claimAmount+", that you can apply towards your plan. Once you claim your award, you can use it to enable feature of your choice. It has no expiration date, can only be applied to your subscription, can not be refunded by any means and can be used only as promotional value to our service."} data-original-title={"Claim your $"+this.state.claimAmount}
                                    >Claim ${this.state.claimAmount}</button>

                                    </div>

								<table className=" table table-hover table-striped datatable table-light">
							{this.accountDataTable()}
								</table>
                                <div className="form-group">
                                    <label htmlFor="disabledTextInput">Your Plan</label>
<span className="col-xs-12 ">
						<div className="form-group">
                            <select name="planSelector" id="planSelector" className="form-control" visible={this.state.editDisabled} disabled={this.state.editDisabled} value={this.state.planSelector}
                                    onChange={this.handleChange.bind(this, 'changeBoxSize')} value={this.state.planSelector}>
                                {this.planOptions()}
                            </select>
                        </div>
					</span>
                                </div>

								<h3 className="pull-left">Selected Plan Overview:</h3>

								<table className=" table table-hover table-striped datatable table-light">

							{this.planTable()}

								</table>


								<div className="clearfix"></div>

								<div className="pull-right dialog_buttons">
									<button type="button" className={"btn btn-primary "+this.state.editPlanButtonClass} onClick={this.handleClick.bind(this, 'editPlan')}>Edit</button>

									<button type="button" className={"btn btn-primary "+this.state.saveButtonClass} onClick={this.handleClick.bind(this, 'savePlan')}>Save</button>


									<button type="button" className={"btn btn-default "+this.state.cancelEditClass} onClick={this.handleClick.bind(this, 'cancelEdit')}>Cancel</button>

								</div>
							</div>

							<div className={this.state.secondPanelClass}>
								<h3 className="hidden">
								Payment
								</h3>
								<span className="hidden">Outstanding Balance:{accounting.formatMoney(this.state.outstandingBalance)}</span>
								<div className="form-group">
									<select className="form-control" onChange={this.handleChange.bind(this, 'changePayment')} value={this.state.paymentType}>
										<option value="">Please Choose Refill Option</option>
										<option value="bit">Bitcoin</option>
										<option value="paypal">PayPal</option>
									</select>
								</div>

                                <span className="bold">
                                Info: <i className="">You will be asked to enter desired refill amount.<br/> It may take up to a minute to reflect new balance after successfull payment. <br/> If you pay with bitcoin, make sure you enter exact amount you are willing to pay, otherwise it may be marked as mispayment.</i></span>


														<div className="clearfix"></div>
								<div className="pull-right dialog_buttons">

									<a type="button" className={"btn btn-primary "+this.state.paypalPay} href={"https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=8G7WAMVVK42YL&custom="+app.user.get("userId")} target="_blank">Pay With PayPal</a>

									<a type="button" className={"btn btn-primary "+this.state.bitcoinPay} href={this.state.bitcoinLink} target="_blank">Pay With Bitcoin</a>

									<button type="button" className="btn btn-default" onClick={this.handleClick.bind(this, 'showFirst')}>Cancel</button>
								</div>


                                <div className="clearfix"></div>
                                <div className="donate-but dialog_buttons hidden">
                                    <a className="coinbase-button" data-code="5fa6623d67032c9fb34b28e16884fc86" data-button-style="donation_small" href="https://www.coinbase.com/checkouts/78eb7e31a3b73ff0588b5c7aa481ec2b" target="_blank"><img src="img/bitdonation.png"/></a>

                                    <a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=B7ERL7QY4HK7Q" target="_blank"><img src="img/btn_donate_LG.gif"/></a>

                                </div>
                            </div>


						</div>
					</div>

					<div className="col-lg-5 col-xs-12 personal-info ">
						<div className="panel panel-default">
							<div className="panel-heading">
								<h3 className="panel-title personal-info-title">Help</h3>

							</div>

							<div className="panel-body">

								<p>
									<b>Available Balance</b>&nbsp;
                                    - Balance available for purchasing new features. <br/> If you load more funds than your monthly plan it will be rolled to the next payment cycle and automatically extend your plan. <br/> (i.e if your 'Cycle Estimate' is $2, and you have $24 available balance, it will cover your subscription for the next 12 months).
								</p>
								<p>
									<b>Prorated Cost</b>&nbsp;
                                    - calculated price for selected features from first day of purchase until the end of the current billing cycle
								</p>

								<p>
									<b>Paid this cycle</b>&nbsp;
                                    - amount paid for this billing cycle. You can modify your subscription within this dollar amount and not be charged extra. For example, decreasing unneeded disposable address and adding more aliases. If any amount is unused by the end of the billing cycle, it will be lost.
								</p>
                                <p>
                                    <b>Next Cycle Estimate</b>&nbsp;
                                    - Estimated Available Balance needed for you plan to auto renew.
                                </p>
                                <p>
                                    <b>Next Billing</b>&nbsp;
                                    - The date when we will try to auto-renew your plan
                                </p>
                                <p>

                                    <b><span className="fa-stack">
                      <i className="fa fa-circle fa-stack-1x"></i>
                      <i className="fa fa fa-usd fa-stack-1x fa-inverse"></i>
                    </span></b>&nbsp;
                                    - Feature that is free, but require at least one paid feature to be enabled.
                                </p>

                                <p>
                                    <b>Mailbox Size</b>&nbsp;
                                    - Total available storage including emails and attachments
                                </p>
                                <p>
                                    <b>PGP Key Strength:</b>&nbsp;
                                    - Select you PGP key strength. Higher bits means stronger encryption, but can downgrade performance.
                                </p>

                                <p>
                                    <b>Aliases</b>&nbsp;
                                    - Slide the bar to select how many aliases you would like to use
                                </p>
                                <p>
                                    <b>Disposable Address</b>&nbsp;
                                    - Slide the bar to select how many disposable emails you need
                                </p>
                                <p>
                                    <b>Folder Expiration</b>&nbsp;
                                    - Enable to auto-delete old emails. Configurable for each folder.
                                </p>

							</div>
						</div>
					</div>

				</div>
				);
		}

	});
});
