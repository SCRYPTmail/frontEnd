/**
 * Author: Sergei Krutov
 * Date: 11/12/15
 * For: SCRYPTmail.com.
 * Version: RC 0.99
 *
 * Function to fetch incoming emails and to all hard work
 */
define([
	"app", "forge",'openpgp'
], function (app, forge,openpgp) {
	"use strict";
	var fetchingEmails = Backbone.Model.extend({
        //app.mailMan
        initialize: function(){
            this.set({"emailHashes":{}});
            this.set({"emailKeysByHashes":{}});
            this.set({'checkNewEmails':false});
            this.set({'mailCheckInterval':{}});
            this.set({'makeItFaster':false});

        },
		//defaults: {
		//	loginDisable: false,
			//buttonText: 'Create Account',
			//buttonTag: '',
			//picture: null
		//},

        startShift:function(){
            //app.user set flag checking email if is set disable check spin in mailbox or represent state
            var thisComp=this;


                if(app.user.get("checkNewEmails")===false){


                    clearTimeout(app.mailMan.get('mailCheckInterval'));

                    app.user.set({"checkNewEmails":true});
                    var mailV1=$.Deferred();
                    var mailV2=$.Deferred();

                    app.mailMan.preparations()
                        .then(function () {

                            app.mailMan.fetchEmail()
                                .then(function (result) {

                                    if (result['response'] === 'success' && result['data'] != undefined) {
                                        //old fetching can be disabled after Feb, 2016
                                        if (result['data']['v1'] != undefined && Object.keys(result['data']['v1']).length > 0) {

                                            app.mailMan.decodeV1(result['data']['v1'], function (decryptedSeedObject) {
                                                //next step is to get metadata from email
                                                app.mailMan.getMetaV1(decryptedSeedObject, function (metaObjects) {
                                                   // console.log(metaObjects);
                                                    if (metaObjects['response'] === 'success' && Object.keys(metaObjects['data']).length > 0) {
                                                        app.mailMan.decodeMetaV1(metaObjects['data'], function (decryptedMeta) {
                                                            if (Object.keys(decryptedMeta).length > 0) {

                                                                app.mailMan.saveEmailIntoInbox(decryptedMeta, function () {
                                                                    mailV1.resolve();
                                                                    app.mailMan.set({'makeItFaster':true});
                                                                });
                                                            }else{

                                                            mailV2.resolve();
                                                            app.mailMan.set({'makeItFaster':true});
                                                        }

                                                        });
                                                    }
                                                });

                                            });
                                        }else{
                                            mailV1.resolve();
                                        }

                                        //todo add last time email checked, prevent from fetching improper data(if hash match with other user)

                                        if (result['data']['v2'] != undefined && Object.keys(result['data']['v2']).length > 0) {
                                            app.user.set({"lastIdKey":result['data']['lastId']});
                                           // console.log(result['data']['lastId']);
                                            app.mailMan.decodeV2(result['data']['v2'], function (decryptedSeedObject) {
                                                //next step is to get metadata from email, but we already have that and its ready to be saved in our objects
                                                if (Object.keys(decryptedSeedObject).length > 0) {
                                                    app.mailMan.applyFilter(decryptedSeedObject, function () {
                                                        app.mailMan.saveEmailIntoInboxV2(decryptedSeedObject, function () {
                                                                mailV2.resolve();
                                                                app.mailMan.set({'makeItFaster':true});
                                                        });
                                                    });
                                                }else{

                                                    mailV2.resolve();
                                                    app.mailMan.set({'makeItFaster':true});
                                                }

                                            });
                                        }else{
                                            mailV2.resolve();
                                        }

                                    } else {

                                        mailV1.resolve();
                                        mailV2.resolve();

                                    }

                                    mailV1.done(function () {
                                        mailV2.done(function () {

                                            setTimeout(function () {
                                                app.user.set({"checkNewEmails": false});
                                            }, 1000); //just to give notice somethig is going on


                                            var time=30000;
                                            if(app.mailMan.get('makeItFaster')){
                                                time=25000;
                                            }
                                            app.mailMan.set({'makeItFaster':false});
                                            var schedule=setTimeout(function () {
                                                thisComp.startShift();
                                            }, time);

                                            app.mailMan.set({'mailCheckInterval':schedule});

                                            app.globalF.syncUpdates();


                                        });
                                    });




                                });


                        });
                }


        },
        applyFilter:function(decryptedMeta,callback){
            var filter =app.user.get('filter');

            if(Object.keys(filter).length>0){

                $.each(decryptedMeta, function (messageId, messageObj) {

                    $.each(filter, function (filterId, filterRule) {
                        var match=false;

                        //sender part
                        if(filterRule['field']==='sender'){

                            var mSender=app.transform.from64str(messageObj['meta']['from']).trim().toLowerCase();

                            var fSender=app.transform.from64str(filterRule['text']).trim().toLowerCase();

                            if(filterRule['match']==="strict"){
                                app.globalF.parseEmail(mSender,'',function(result){
                                    mSender=result['email'];
                                });

                                if(mSender===fSender){
                                    match=true;
                                }

                            }else if(filterRule['match']==="relaxed"){

                                if(mSender.indexOf(fSender) > -1){
                                    match=true;
                                }

                            }else if(filterRule['match']==="negative"){

                                if(mSender.indexOf(fSender) === -1){
                                    match=true;
                                }
                            }

                        }

                        //subject
                        if(filterRule['field']==='subject'){

                            var mSubject=app.transform.from64str(messageObj['meta']['subject']).trim().toLowerCase();
                            var fSubject=app.transform.from64str(filterRule['text']).trim().toLowerCase();

                            if(filterRule['match']==="strict"){

                                if(mSubject===fSubject){
                                    match=true;
                                }

                            }else if(filterRule['match']==="relaxed"){

                                if(mSubject.indexOf(fSubject) > -1){
                                    match=true;
                                }

                            }else if(filterRule['match']==="negative"){

                                if(mSubject.indexOf(fSubject) === -1){
                                    match=true;
                                }
                            }

                        }

                        //to
                        if(filterRule['field']==='rcpt'){

                            //recpt is array
                            var allRcpt=$.merge(messageObj['meta']['to'], messageObj['meta']['toCC']);
                            var fRcpt=app.transform.from64str(filterRule['text']).trim().toLowerCase();

                            $.each(allRcpt, function (index, recipient) {

                                var mRcpt=app.transform.from64str(recipient).trim().toLowerCase();

                                if(filterRule['match']==="strict"){

                                    app.globalF.parseEmail(mRcpt,'',function(result){
                                        mRcpt=result['email'];
                                    });

                                    if(mRcpt===fRcpt){
                                        match=true;
                                    }

                                }else if(filterRule['match']==="relaxed"){

                                    if(mRcpt.indexOf(fRcpt) > -1){
                                        match=true;
                                    }

                                }else if(filterRule['match']==="negative"){
                                    if(mRcpt.indexOf(fRcpt) === -1){
                                        match=true;
                                    }
                                }

                            });


                        }

                        if(match===true){
                            decryptedMeta[messageId]['sugFolder']=filterRule['to'];
                        }

                    });
                    //console.log(messageObj);
                });

            }
            //console.log(filter);

           // console.log(decryptedMeta);

            callback(decryptedMeta);



        },

        saveEmailIntoInboxV2: function(decryptedMeta,callback){

          //  console.log(decryptedMeta);

            /*
             1) get new emailId,
             2) create message with this id in folder Dir(inbox)
             3) send data to save folderObject and deleting email from queue
             */
            /*


             fr:""; //from
             to:[]; //to
             sb:""; //subject
             bd:""; //body
             tc:""; //created
             tr:""; //received
             mK:""; //modKey
             at:0; //attachment
             pn:""; //pin
             en:3; //encrypted 1-scryptmail internal,0-clear,3-unknown
             sg:""; //encrypted signature
             sgM:false; //manual signature

             tp:0; //type 1-received,2 sent,3draft
             sz:0; //size
             //st:1;//status 1-replied,2-forwarder,3-opened,0-unopened
             vr:1;//version
             */

            var messageObj={

            };
            var emailpromises=[];

            $.each(decryptedMeta, function (emailMetaId, data) {

                var modK = app.globalF.makeModKey();
                var d = new Date();
                var post = {
                    modKey: modK
                };
                var emailMetaPromise = $.Deferred();

                app.serverCall.ajaxRequest('getDraftMessageId', post, function (result) {
                    if (result['response'] == "success") {

                        decryptedMeta[emailMetaId]['persFid']=result['data']['messageId'];
                        decryptedMeta[emailMetaId]['persFmodKey']=modK;

                        var destFolder=app.user.get('systemFolders')['inboxFolderId'];
                        if(data['sugFolder']!=undefined){
                            var allFolders=app.user.get('folders');
                            if(allFolders[data['sugFolder']]!=undefined){
                                destFolder= data['sugFolder'];
                            }
                        }
                        var sentDate=0;
                        if(data['timeSent']!==undefined){
                            sentDate= parseInt(data['timeSent']);
                        }else if(data['meta']['timeRcvd']!==undefined) {
                            sentDate= parseInt(data['meta']['timeRcvd']);
                        }else{
                            sentDate= parseInt(data['meta']['timeSent'])
                        }

                        messageObj[result['data']['messageId']]={

                            'p':data['meta']['emailKey'], //password
                            'b':"", //block to decide later
                            'tc':parseInt(data['meta']['timeSent']), //
                            'tg':[],
                            'f':destFolder, //folder to inbox
                            'fr':data['meta']['from'], //from


                            'to':$.merge(data['meta']['to'], data['meta']['toCC'] ), //to

                            'sb':data['meta']['subject'], //subject
                            'bd':data['meta']['body'], //body


                            'tr':sentDate, //timeSent received - outside more
                            //'tr':Math.round(d.getTime() / 1000), //received
                            'mK':modK, //modKey
                            'at':data['meta']['attachment'], //attachment
                            'pn':data['meta']['pin'], //pin
                            'en':data['meta']['en'], //encrypted 1-scryptmail internal,0-clear,3-unknown
                            'sg':"", //encrypted signature
                            'sgM':false, //manual signature

                            'tp':1, //type 1-received,2 sent,3draft
                            'sz':parseInt(data['emailSize']), //size
                            'st':0,//status 1-replied,2-forwarder,3-opened,0-unopened
                            'vr':2//version

                        };

                        emailMetaPromise.resolve();
                    }
                });

                emailpromises.push(emailMetaPromise);
            });


            Promise.all(emailpromises).then(function() {
             //   console.log(messageObj);
                var folder = app.user.get('systemFolders')['inboxFolderId'];

                    app.globalF.addNewMessageToFolder(messageObj, folder, function () {
                        var message2Delete=[];
                        $.each(decryptedMeta, function (oldMessageId, data) {
                            var messageData={
                                'mailQId':oldMessageId,
                                'mailModKey':data['mailModKey'],
                                'persFid':data['persFid'],
                                'persFmodKey':data['persFmodKey']
                            };

                            message2Delete.push(messageData);

                        });

                        app.userObjects.updateObjects('saveNewEmailV2', message2Delete, function (result) {

                             callback();

                        });

                    });

            });




        },


        saveEmailIntoInbox: function(decryptedMeta,callback){

          //  console.log(decryptedMeta);

            /*
                1) get new emailId,
                2) create message with this id in folder Dir(inbox)
                3) send data to save folderObject and deleting email from queue
            */
/*


            fr:""; //from
            to:[]; //to
            sb:""; //subject
            bd:""; //body
            tc:""; //created
            tr:""; //received
            mK:""; //modKey
            at:0; //attachment
            pn:""; //pin
            en:3; //encrypted 1-scryptmail internal,0-clear,3-unknown
            sg:""; //encrypted signature
            sgM:false; //manual signature

            tp:0; //type 1-received,2 sent,3draft
            sz:0; //size
            //st:1;//status 1-replied,2-forwarder,3-opened,0-unopened
            vr:1;//version
            */

            var messageObj={

            };
            var emailpromises=[];

            $.each(decryptedMeta, function (emailMetaId, metaData) {
                var modK = app.globalF.makeModKey();
                var d = new Date();
                var post = {
                    modKey: modK
                };
                var emailMetaPromise = $.Deferred();

                    app.serverCall.ajaxRequest('getDraftMessageId', post, function (result) {
                        if (result['response'] == "success") {

                            decryptedMeta[emailMetaId]['persFid']=result['data']['messageId'];
                            decryptedMeta[emailMetaId]['persFmodKey']=modK;

                            messageObj[result['data']['messageId']]={
                                'p':app.transform.to64bin(metaData['fethingData']['mailPass']), //password
                                'b':"", //block to decide later
                                'tc':metaData['email']['timeSent'], //created
                                'tg':[],
                                'f':app.user.get('systemFolders')['inboxFolderId'], //folder to inbox
                                'fr':metaData['email']['from'], //from
                                'to':(metaData['v']==="1"?[metaData['email']['to']]:metaData['email']['to']), //to
                                'sb':metaData['email']['subject'], //subject
                                'bd':metaData['email']['body'], //body

                                'tr':Math.round(d.getTime() / 1000), //received
                                'mK':modK, //modKey
                                'at':metaData['email']['attachment']===""?0:metaData['email']['attachment'], //attachment
                                'pn':metaData['email']['pin'], //pin
                                'en':3, //encrypted 1-scryptmail internal,0-clear,3-unknown,2-pin,4-pgp
                                'sg':metaData['email']['signature']!=undefined?metaData['email']['signature']:"", //encrypted signature
                                'sgM':false, //manual signature

                                'tp':1, //type 1-received,2 sent,3draft
                                'sz':parseInt(metaData['fethingData']['emailSize']), //size
                                 st:0,//status 1-replied,2-forwarder,3-opened,0-unopened
                                'vr':1,//version

                            };
                            emailMetaPromise.resolve();
                        }

                    });
                emailpromises.push(emailMetaPromise);
            });
            Promise.all(emailpromises).then(function() {
                //console.log(messageObj);


                var folder = app.user.get('systemFolders')['inboxFolderId'];

                    app.globalF.addNewMessageToFolder(messageObj, folder, function () {

                        var message2Delete=[];
                        //console.log(decryptedMeta)
                        $.each(decryptedMeta, function (oldMessageId, data) {

                            var messageData={
                                'seedId':data['fethingData']['seedId'],
                                'seedModKey':data['fethingData']['seedModKey'],
                                'mailQId':data['fethingData']['metaId'],
                                'mailModKey':data['fethingData']['mailModKey'],
                                'persFid':data['persFid'],
                                'persFmodKey':data['persFmodKey']
                            };
                            message2Delete.push(messageData);
                        });
                        //console.log(message2Delete);
                       // var data={
                       //    'message2Delete':message2Delete,
                       // };

                        app.userObjects.updateObjects('saveNewEmailV1', message2Delete, function (result) {

                            callback();

                        });

                    });

            });

        },

        /**
         *
         * @param metaObjectsEncrypted
         * @param callback
         */
        decodeMetaV1: function(metaObjectsEncrypted,callback){
          // console.log(metaObjectsEncrypted);
            var pki = forge.pki;
            var keysByHash=app.mailMan.get("emailKeysByHashes");
            var decryptedMetaObject={};

            $.each(metaObjectsEncrypted, function (emailMetaId, metaData) {

                var privateKey={
                    'key':pki.privateKeyFromPem(app.v1transform.from64(keysByHash[metaData['rcpnt']]['privateKey'])),
                    'length':keysByHash[metaData['rcpnt']]['keyLength']/4
                 };

                if(metaData['v']==="1"){
                    var paddedPassword=metaData['pass'];
                    var password=privateKey['key'].decrypt(forge.util.hexToBytes(paddedPassword.substr(0,privateKey['length'])), 'RSA-OAEP');
                }else if(metaData['v']==="15"){
                    var password=privateKey['key'].decrypt(app.transform.from64bin(metaData['pass']), 'RSA-OAEP');
                }


                decryptedMetaObject[emailMetaId]= {
                    'email': JSON.parse(app.transform.fromAes64(password, metaData['meta'])),
                    'fethingData': metaData
                };

                decryptedMetaObject[emailMetaId]['fethingData']['mailPass']=password;
                decryptedMetaObject[emailMetaId]['fethingData']['mailModKey']=decryptedMetaObject[emailMetaId]['email']['modKey'];
                decryptedMetaObject[emailMetaId]['v']=metaData['v'];
            });

            callback(decryptedMetaObject);
           // console.log(decryptedMetaObject);

        },

        /**
         *
         * @param decryptedSeedObject
         * @param callback
         */
        getMetaV1:function(decryptedSeedObject,callback){
            //fetch metadata from emails before moving it to inbox
            var emailData={};
            $.each(decryptedSeedObject, function (index, data) {
                emailData[data['mailId']]=data['mailModKey'];

            });

            var post={
                'emailData':JSON.stringify(emailData)
            };

            app.serverCall.ajaxRequest('getNewMeta', post, function (result) {
                if(result['response']==='success' && Object.keys(result['data']).length>0){

                    $.each(decryptedSeedObject, function (index, data) {
                        if(result['data'][data['mailId']]!=undefined){
                            result['data'][data['mailId']]['seedId']=data['seedId'];
                            result['data'][data['mailId']]['seedModKey']=data['seedModKey'];
                            result['data'][data['mailId']]['rcpnt']=data['rcpnt'];
                            result['data'][data['mailId']]['seedPass']=data['seedPass'];
                            result['data'][data['mailId']]['v']=data['v'];
                        }
                    });
                }
                //console.log(result);
               callback(result);
            });

        },


        decodeV2:function(emailsObjects,callback){
            //console.log(emailsObjects);
            var keysByHash=app.mailMan.get("emailKeysByHashes");
            var decryptedSeedObject={};
            var decryptionPromise=[];

            $.each(emailsObjects, function (index, data) {

                var key = app.transform.from64str(keysByHash[data['rcpnt']]['privateKey']);
                var keyPass=keysByHash[data['rcpnt']]['keyPass'];
                var encryptedMessage=app.transform.from64bin(data['meta']);
                var emailPromise = $.Deferred();

                app.transform.PGPmessageDecrypt(key,keyPass,encryptedMessage,function(decryptedText64){

                    if(decryptedText64!==false){
                        var decryptedTextObj=JSON.parse(app.transform.from64str(decryptedText64));

                        //console.log(decryptedTextObj);

                        decryptedSeedObject[index]={
                            'mailId':index,
                            'mailModKey':decryptedTextObj['modKey'],
                            'emailKey':decryptedTextObj['emailKey'],
                            'rcpnt':data['rcpnt'],
                            'meta':decryptedTextObj,
                            'file':data['file'],
                            'emailSize':data['emailSize'],
                            'v':2,
                            'timeSent':data['timeSent']
                        };
                    }
                    emailPromise.resolve();
                });

                decryptionPromise.push(emailPromise);
            });

            Promise.all(decryptionPromise).then(function(values) {
                callback(decryptedSeedObject);
               // console.log(decryptedSeedObject);
            });

        },
        /**
         *
         * @param emailsObjects
         * @param callback
         */
        decodeV1:function(emailsObjects,callback){
            var pki = forge.pki;
            var keysByHash=app.mailMan.get("emailKeysByHashes");
            var decryptedSeedObject={};

            $.each(emailsObjects, function (index, data) {

              //  console.log(data);
                var privateKey={
                    'key':pki.privateKeyFromPem(app.v1transform.from64(keysByHash[data['rcpnt']]['privateKey'])),
                    'length':keysByHash[data['rcpnt']]['keyLength']/4
                };
                if(data['v1']==="1"){
                    var paddedPassword=data['password'];
                    var password=privateKey['key'].decrypt(forge.util.hexToBytes(paddedPassword.substr(0,privateKey['length'])), 'RSA-OAEP');
                    var message=JSON.parse(app.v1transform.fromAes(password,data['meta']));
                }else if(data['v1']==="15"){
                    var password=privateKey['key'].decrypt(app.transform.from64bin(data['password']), 'RSA-OAEP');
                    var message=JSON.parse(app.transform.fromAes64(password,data['meta']));
                }
                //console.log(message);
                decryptedSeedObject[index]={
                    'seedId':index,
                    'mailId':message['mailId'],
                    'mailModKey':message['mailModKey'],
                    'seedModKey':message['seedModKey'],
                    'seedPass':password,
                    'rcpnt':data['rcpnt'],
                    'v':data['v1']
                };

            });

            callback(decryptedSeedObject);

        },

        /**
         *
         * @returns {*}
         */
        fetchEmail:function(){
            var dfd = jQuery.Deferred();

            var post={
                'emailHashes':JSON.stringify(app.mailMan.get("emailHashes")),
                'limit':50,
                'lastIdKey': app.user.get("lastIdKey")
            }

            app.serverCall.ajaxRequest('getNewSeeds', post, function (result) {
                dfd.resolve(result);
            });


            return dfd.promise();
        },

        /**
         *
         * Check available keys and email addresses for fetching
         *
         * @param callback
         */
        preparations: function(){
            //check all keys
            var dfd = jQuery.Deferred();

                var keys=app.user.get('allKeys');
                var hashes={
                    'v1':[],
                    'v2':[]
                };
                var emailByhash={};
            //console.log(app.user.get('allKeys'));

                $.each(keys, function (email64, emailData) {
                    //hashes.push(emailData['v1']['receiveHash']);
                   //hashes.push(emailData['v2']['receiveHash']);

                    if(emailData['v1']!=undefined){
                        hashes['v1'].push(emailData['v1']['receiveHash']);

                        emailByhash[emailData['v1']['receiveHash']]=jQuery.extend(true, {}, emailData['v1']);
                        emailByhash[emailData['v1']['receiveHash']]['version']=1;
                        emailByhash[emailData['v1']['receiveHash']]['keyLength']=emailData['keyLength'];
                    }

                    hashes['v2'].push(emailData['v2']['receiveHash']);

                    emailByhash[emailData['v2']['receiveHash']]=jQuery.extend(true, {}, emailData['v2']);
                    emailByhash[emailData['v2']['receiveHash']]['version']=2;
                    emailByhash[emailData['v2']['receiveHash']]['keyPass']=emailData['keyPass'];



                });

                app.mailMan.set({
                    "emailHashes":hashes,
                    "emailKeysByHashes":emailByhash
                });
                dfd.resolve();

            return dfd.promise();

        }

	});

	return fetchingEmails;
});