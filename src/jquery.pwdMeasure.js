;(function($, window, undefined){
	"use strict";

	var version = "1.0.0",

	MAX_CHAR = 12,

	Status = {
		VALID: 1,
		INVALID: 2,
		NOT_MATCH: 3
	},

	labelObjDefault = {
		score: 100,
		label: "",
		class: ""
	},

	// Default Options
	defaults = {
		minScore: 50,
		minLength: 6,
		events: "keyup change",
		labels: [
			{score:10, label:"とても弱い", class:"very-weak"},    //0~10%
			{score:30, label:"弱い", class:"weak"},               //11~30%
			{score:50, label:"平均", class:"average"},            //31~50%
			{score:70, label:"強い", class:"strong"},             //51~70%
			{score:100, label:"とても強い", class:"very-strong"}, //71~100%
			{score:"notMatch", label:"不一致", class:"not-match"} //not match
		],
		indicator: "#pm-indicator",
		indicatorTemplate: "パスワード強度: <%= label %> (<%= percentage %>%)",
		confirm: false,

		// Callbacks
		onValid: false,
		onInvalid: false,
		onNotMatch: false,
		onChangeState: false,
		onChangeValue: false
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
		eventName: "",

		percentage: 0,
		char: {
			numbers: [],
			upperLetters: [],
			lowerLetters: [],
			specialChars: []
		},

		indicatorDefaultHtml: "",
		status: Status.INVALID,
		currentLabelObj: {},

		$elem: null,
		$indicator: null,
		$confirm: null
	};

	/**
	 * 初期化
	 * @param jQueryObj
	 * @param object
	 * @return void
	 */
	PwdMeasure.prototype._initialize = function($elem, options){
		this.options = options;

		this.options.labels = $.map(this.options.labels, function(labelObj){
			return $.extend({}, labelObjDefault, labelObj);
		});

		var i;
		for( i = 48; i < 58; i++ ) this.char.numbers.push(i);
		for( i = 65; i < 91; i++ ) this.char.upperLetters.push(i);
		for( i = 97; i < 123; i++ ) this.char.lowerLetters.push(i);
		for( i = 32; i < 48; i++ ) this.char.specialChars.push(i);
		for( i = 58; i < 65; i++ ) this.char.specialChars.push(i);
		for( i = 91; i < 97; i++ ) this.char.specialChars.push(i);
		for( i = 123; i < 127; i++ ) this.char.specialChars.push(i);

		this.$elem = $elem;
		this.$indicator = $(this.options.indicator);
		this.$confirm = $(this.options.confirm);

		if( this.$indicator.size() > 0 ){
			this.indicatorDefaultHtml = this.$indicator.html();
		}

		this.update();
		this._bindMethods();
	};

	/**
	 * 現在の値から強度を求める
	 * @return void
	 */
	PwdMeasure.prototype.calc = function(){
	  var strength = 0,
	  		found = {
	  			numbers: 0,
	  			upperLetters: 0,
	  			lowerLetters: 0,
	  			specialChars: 0
	  		},
	  		txt = this.$elem.val(),
	  		i, s;

	  strength += 2 * Math.floor(txt.length / this.options.minLength);

	  for( i = 0; i < txt.length; i++ ){

	  	s = ord(txt.charAt(i));

	  	if( $.inArray(s, this.char.numbers)  != -1 && found.numbers < 2 ){
				strength++;
				found.numbers++;
				continue;
	  	}
	  	if( $.inArray(s, this.char.upperLetters) != -1 && found.upperLetters < 2 ){
	  		strength++;
	  		found.upperLetters++;
	  		continue;
	  	}
	  	if( $.inArray(s, this.char.lowerLetters) != -1 && found.lowerLetters < 2 ){
	  		strength++;
	  		found.lowerLetters++;
	  		continue;
	  	}
	  	if( $.inArray(s, this.char.specialChars) != -1 && found.specialChars < 2 ){
	  		strength++;
	  		found.specialChars++;
	  		continue;
	  	}
	  }

	  strength = strength > MAX_CHAR ? MAX_CHAR : strength;
    this.percentage = Math.ceil(strength * 100 / MAX_CHAR);
    this.percentage = this.percentage > 100 ? 100 : this.percentage;
	};

	/**
	 * パスワード強度を元に適切なラベル用のインデックスを取得
	 * @param integer
	 * @param integer
	 * @return string
	 */
	PwdMeasure.prototype.getLabelIndex = function(percentage, status){
		var _this = this,
				index = 0;

		percentage = percentage || _this.percentage;
		status = status || _this.status;

		$.each(_this.options.labels, function(i, d){
			var prev = _this.options.labels[i - 1] || {score:0, label:"", class:""};
			if( $.isNumeric(d.score) ){
				if( !$.isNumeric(prev.score) ) return true; //continue
				prev.score = parseInt(prev.score);
				d.score = parseInt(d.score);
				if( percentage > prev.score && percentage <= d.score ){
					index = i;
				}
			}else if( d.score === "notMatch" && status === Status.NOT_MATCH ){
				index = i;
				return false; //break
			}
		});

		return index;
	}

	/**
	 * パスワード強度を元に適切なラベルオブジェクトを取得
	 * @param integer
	 * @param integer
	 * @return string
	 */
	PwdMeasure.prototype.getLabelObj = function(percentage, status){
		var index = this.getLabelIndex(percentage, status);
		return this.options.labels[index];
	};


	/**
	 * 入力フィールドの値を元に状態を更新
	 * @return void
	 */
	PwdMeasure.prototype.update = function(){
		var status = this.status;

		// Upadte strength percentage
		this.calc();

		// Base + Confirm
		if( this.$confirm.size() > 0 ){
			var val1 = this.$elem.val(),
					val2 = this.$confirm.val();
			if( val2 !== "" ){
				if( val1 === val2 ){
					status = this.percentage >= this.options.minScore ? Status.VALID : Status.INVALID;
				}else{
					status = Status.NOT_MATCH;
				}
			}else{
				status = Status.INVALID;
			}

		// Base(single field)
		}else{
			if( this.percentage >= this.options.minScore ){
				status = Status.VALID;
			}else{
				status = Status.INVALID;
			}
		}

		var isChangeStatus = this.status !== status;
		this.status = status;

		// Current LabelObject
		this.currentLabelObj = this.getLabelObj(null, status);

		// Render
		this._displayIndicator();

		// Callbacks
		this._callbackApply(this.options.onChangeValue, this.percentage, this.currentLabelObj.label, this.currentLabelObj.class);
		
		if( isChangeStatus ){
			var type;
			switch( this.status ){
				case Status.VALID:
					type = "valid";
					this._callbackApply(this.options.onValid, this.percentage, this.currentLabelObj.label, this.currentLabelObj.class);
					break;
				case Status.INVALID:
					type = "invalid";
					this._callbackApply(this.options.onInvalid, this.percentage, this.currentLabelObj.label, this.currentLabelObj.class);
					break;
				case Status.NOT_MATCH:
					type = "notMatch";
					this._callbackApply(this.options.onNotMatch, this.percentage, this.currentLabelObj.label, this.currentLabelObj.class);
					break;
			}
			this._callbackApply(this.options.onChangeState, this.percentage, this.currentLabelObj.label, this.currentLabelObj.class, type);
		}
	};

	/**
	 * 現在の状態を描画
	 * @return void
	 */
	PwdMeasure.prototype._displayIndicator = function(){
		if( this.$indicator.size() === 0 ) return false;

		var html = this.options.indicatorTemplate,
				args = {
					label: this.currentLabelObj.label,
					class: this.currentLabelObj.class,
					percentage: this.percentage
				};

		$.each(args, function(key, value){
			html = html.split("<%= " + key + " %>").join(value);
		});

		html = html.replace(/(<%= .* %>?)/g, "");

		this.$indicator
			.html(html)
			.removeClass(this._allLabelClass())
			.addClass(this.currentLabelObj.class);
	};

	/**
	 * 各種イベントを設定
	 * @return void
	 */
	PwdMeasure.prototype._bindMethods = function(){
		var _this = this;

		// "keyup change" to "keyup.pm change.pm"
		_this.eventName = _this.options.events || "keyup";
		_this.eventName = _this.eventName.replace(/([a-z]+)( ?)/gi, "$1." + ns + "$2");

		// base element
		_this.$elem.on(_this.eventName, $.proxy(_this.update, _this));

		// confirm
		if( _this.$confirm.size() > 0 ){
			_this.$confirm.on(_this.eventName, $.proxy(_this.update, _this));
		}
	};

	/**
	 * 各種イベントを解除
	 * @return void
	 */
	PwdMeasure.prototype._unbindMethods = function(){
	};

	/**
	 * thisを束縛してコールバックを実行
	 * @param function
	 * @param [param1, param2, ...]
	 * @return boolean
	 */
	PwdMeasure.prototype._callbackApply = function(){
		var callback = arguments[0],
				params = sliceArray(arguments, 1),
				f = $.isFunction(callback) ? callback : function(){};
		return f.apply(this.$elem.get(0), params);
	};

	/**
	 * 全てのラベルクラスを文字列で取得
	 * @return string
	 */
	PwdMeasure.prototype._allLabelClass = function(){
		var className = $.map(this.options.labels, function(labelObj){
			return labelObj.class;
		});
		return className.join(" ");
	};

	/**
	 * プラグインを削除
	 * @return void
	 */
	PwdMeasure.prototype.destroy = function(){
		this._unbindMethods();
		this.$elem.removeData("pwdMeasure");

		if( this.$indicator.size() > 0 ){
			this.$indicator
				.html(this.indicatorDefaultHtml)
				.removeClass(this._allLabelClass());
		}
	};


	// Helper
	function sliceArray(array, start, end){
		return Array.prototype.slice.call(array, start, end !== undefined ? end : array.length);
	}

	function ord(str){
		var s = str + "",
				code = s.charCodeAt(0);
		if( 0xD800 <= code && code <= 0xDBFF ){
			var hi = code;
			if( s.length === 1){
				return code;
			}
			var low = s.charCodeAt(1);
			return ( ( hi - ( 0xD800 * -1 ) ) * 0x400 ) + ( low - 0xDC00 ) + 0x10000;
		}
		if( 0xDC00 <= code && code <= 0xDFFF ){
			return code;
		}
		return code;
	}


	// Run pwdMeasure
	$.fn.pwdMeasure = function(options){
		return this.each(function(){
			if( !$(this).data("pwdMeasure") ){
				$(this).data("pwdMeasure", new PwdMeasure($(this), $.extend({}, defaults, options)));
			}
		});
	};


}(jQuery, window));