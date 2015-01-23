;(function($, window, undefined){
	"use strict";

	var version = "1.0.0",

	// Default Options
	defaults = {
		minScore: 50,
		minLength: 6,
		events: "keyup change",
		labels: [
			[10, "とても弱い"], //0~10%
			[30, "弱い"],       //11~30%
			[50, "平均"],       //31~50%
			[70, "強い"],       //31~70%
			[100, "とても強い"] //71~100%
		],
		indicator: "#pm-indicator",
		indicatorTemplate: "パスワード強度: <%= label => (<%= percentage %>%)",
		confirm: false,
		notMatch: "不一致",

		// Callbacks
		onValid: false,
		onInvalid: false,
		onChanged: false,
		onOptionEvent: false
	},

	// Namespace
	ns = "pm";


	// ===============================================================
	// Instance
	// ===============================================================
	function PwdMeasure(){
		this._initialize.apply(this, arguments);
	}

	PwdMeasure.prototype = {
		version: version,
		options: {},

		$elem: null,
		$indicator: null,
		$confirm: null
	};

	PwdMeasure.prototype._initialize = function($elem, options){
	};


	// Run pwdMeasure
	$.fn.pwdMeasure = function(options){
		return this.each(function(){
			if( !$(this).data("pwdMeasure") ){
				$(this).data("pwdMeasure", new PwdMeasure($(this), $.extend({}, defaults, options)));
			}
		});
	};


}(jQuery, window));



// アルゴリズムを仮実装
$(function(){

	var $elem = $("#pwd1");

  var numbersArray = new Array(),
      upperLettersArray = new Array(),
      lowerLettersArray = new Array(),
      specialCharsArray = new Array();

  var percentage = 0;

  var minLength = 6;
  var MAX_CHAR = 12;

  var minScore = 50;

	function calc(){
	  var strength = 0,
	      numbersFound = 0,
	      upperLettersFound = 0,
	      lowerLettersFound = 0,
	      specialCharsFound = 0,
	      text = $elem.val(),
	      i, s;

	  strength += 2 * Math.floor(text.length / minLength);

	  for( i = 0; i < text.length; i++ ){
	  	s = ord(text.charAt(i));
	  	if( $.inArray(s, numbersArray)  != -1 && numbersFound < 2 ){
				strength++;
				numbersFound++;
				continue;
	  	}
	  	if( $.inArray(s, upperLettersArray) != -1 && upperLettersFound < 2 ){
	  		strength++;
	  		upperLettersFound++;
	  		continue;
	  	}
	  	if( $.inArray(s, lowerLettersArray) != -1 && lowerLettersFound < 2 ){
	  		strength++;
	  		lowerLettersFound++;
	  		continue;
	  	}
	  	if( $.inArray(s, specialCharsArray) != -1 && specialCharsFound < 2 ){
	  		strength++;
	  		specialCharsFound++;
	  		continue;
	  	}
	  }

	  strength = strength > MAX_CHAR ? MAX_CHAR : strength;
    percentage = Math.ceil(strength * 100 / MAX_CHAR);
    percentage = percentage > 100 ? 100 : percentage;

	  return strength;
	}

	// Helper
	function ord(string){
		var str = string + "",
				code = str.charCodeAt(0);
		if( 0xD800 <= code && code <= 0xDBFF ){
			var hi = code;
			if( str.length === 1){
				return code;
			}
			var low = str.charCodeAt(1);
			return ( ( hi - -0xD800 ) * 0x400 ) + ( low - 0xDC00 ) + 0x10000;
		}
		if( 0xDC00 <= code && code <= 0xDFFF ){
			return code;
		}
		return code;
	}


	// Initialize
	for(var i = 48; i < 58; i++) numbersArray.push(i);
	for(i = 65; i < 91; i++) upperLettersArray.push(i);
	for(i = 97; i < 123; i++) lowerLettersArray.push(i);
	for(i = 32; i < 48; i++) specialCharsArray.push(i);
	for(i = 58; i < 65; i++) specialCharsArray.push(i);
	for(i = 91; i < 97; i++) specialCharsArray.push(i);
	for(i = 123; i < 127; i++) specialCharsArray.push(i);

	calc();
	$elem.on("keyup change", function(e){
		calc();
		if( percentage >= minScore ){
			console.log("clear!!");
		}
		console.log($(this).val(), percentage);
	});
});



