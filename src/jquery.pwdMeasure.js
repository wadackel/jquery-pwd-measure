;(function($, window, undefined){
	"use strict";

	var version = "1.0.0",

	// Default Options
	defaults = {
		minScore: 50,
		events: "keyup change",
		labels: [
			[10, "すごく弱い"], //0~10%
			[30, "弱い"],       //11~30%
			[60, "平均"],       //31~60%
			[100, "強い"]       //61~100%
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
$("#pwd1").on("keyup change", function(e){
	console.log($(this).val());
});




