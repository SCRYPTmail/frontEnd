define([
	"app","forge","CryptoJS","twofish"
], function(app,forge,CryptoJS,TwoFish){

	var Version1Functions = Backbone.Model.extend({
		//app.v1transform
		SHA512: function (data) {
			var md = forge.md.sha512.create();
			md.update(data, 'utf8');
			return md.digest().toHex();
		},

		hex2bin:function (hex) {
			return forge.util.hexToBytes(hex)
		},

		from64: function(data) {
		if (data instanceof Array) {
			$.each(data, function (index, value) {
				data[index] = app.transform.from64(value);
			});
			return data;
		} else if (data instanceof Object) {
			//console.log('object');
			$.each(data, function (index, value) {
				data[index] = app.transform.from64(value);
			});
			return data;
		} else
			return forge.util.decodeUtf8(forge.util.decode64(data));
		},

		to64: function (data) {

			if (data instanceof Array) {
				$.each(data, function (index, value) {
					data[index] = app.transform.to64(value);
				});
				return data;
			} else if (data instanceof Object) {
				$.each(data, function (index, value) {
					//console.log(index);
					//console.log(value);
					data[index] = app.transform.to64(value);
				});
				return data;
			} else
				return forge.util.encode64(forge.util.encodeUtf8(String(data)));

		},
		toAes: function (key, text) {

			var vector = forge.random.getBytesSync(16);

			var cipher = forge.cipher.createCipher('AES-CBC', key);
			cipher.start({iv: vector});

			var usUtf8 = forge.util.encodeUtf8(text);
			cipher.update(forge.util.createBuffer(usUtf8));
			cipher.finish();

			return forge.util.bytesToHex(vector) + cipher.output.toHex();

		},

		toAesToken: function (key, text) {

			var vector = forge.random.getBytesSync(16);

			var cipher = forge.cipher.createCipher('AES-CBC', key);
			cipher.start({iv: vector});

			cipher.update(forge.util.createBuffer(text));
			cipher.finish();

			return forge.util.bytesToHex(vector) + cipher.output.toHex();

		},

		toFish: function (keyT, text) {

			var vector = CryptoJS.lib.WordArray.random(16);
			var cipher = CryptoJS.TwoFish.encrypt(text, keyT, { iv: vector });

			//console.log(keyT.toString());

			return vector.toString() + cipher.toString();

		},



		fromFish: function (keyT, text) {
			var vector = CryptoJS.enc.Hex.parse(text.substring(0, 32));
			var encrypted = text.substring(32);

			var cipher = CryptoJS.TwoFish.decrypt(encrypted, keyT, { iv: vector });
			return cipher.toString(CryptoJS.enc.Latin1);
		},

		fromAes: function(key, text) {

			var vector = forge.util.hexToBytes(text.substring(0, 32));
			var encrypted = text.substring(32);

			var cipher = forge.cipher.createDecipher('AES-CBC', key);
			var new_buffer = forge.util.createBuffer(forge.util.hexToBytes(encrypted));

			cipher.start({iv: vector});
			cipher.update(new_buffer);
			cipher.finish();
			//return forge.util.decodeUtf8(cipher.output.toString());

			var f=cipher.output.toString();
			return f.substring(f.indexOf('{'), f.lastIndexOf('}') + 1);
		},


		dbToProfile: function(obj, secret,salt) {

			//console.log(secret);
			//salt = forge.util.hexToBytes(salt);
			//var derivedKey =app.globalF.makeDerived(secret, salt);
			var derivedKey =secret;
			var Test = forge.util.bytesToHex(derivedKey);

			var keyT = CryptoJS.enc.Hex.parse(Test.substr(0, 64));
			var keyA = forge.util.hexToBytes(Test.substr(64, 128));

			//var ivT = CryptoJS.enc.Hex.parse(obj['vectorT']);
			//var ivA = forge.util.hexToBytes(obj['vectorA']);

			//base64
			var Fis = app.v1transform.fromFish(keyT, obj);

			//hex

			var f = app.v1transform.fromAes(keyA, Fis);

		return f;


	},
		profileToDb: function (obj,secret,salt) {

			//salt = forge.util.hexToBytes(salt);
			//var derivedKey = app.globalF.makeDerived(secret, salt);
			var derivedKey =secret;

			var Test = forge.util.bytesToHex(derivedKey);

			var keyT = CryptoJS.enc.Hex.parse(Test.substr(0, 64));
			var keyA = forge.util.hexToBytes(Test.substr(64, 128));

			var f = app.transform.toAes(keyA, JSON.stringify(obj));
			var Fis = app.transform.toFish(keyT, f);

			return Fis;

		}


	});

	return Version1Functions;
});