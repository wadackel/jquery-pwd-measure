jQuery.pwdMeasure
====


## Version
0.0.0


## Description
パスワードの強度を測定するjQueryプラグインです。


## Demo
[http://example.com/](http://example.com/)


## Features
pwdMeasureの特徴は下記のとおりです。

* パスワードの強度をパーセント表示可能
* 単一の入力フィールド、確認フィールドへの対応
* 強度を示すラベルを詳細に設定可能
* 必要最低限のパスワード強度をパーセント指定可能
* 判定をクリアした時、値が変わった時などのコールバックをサポート



## How To Use

### jQuery、jquery.pwdMeasure.jsを読み込みます

~~~~html
<script type="text/javascript" src="//code.jquery.com/jquery-1.11.2.min.js"></script>
<script type="text/javascript" src="js/jquery.pwdMeasure.min.js"></script>
~~~~

### HTML

~~~~html
<input type="password" id="pwd" name="pwd" value="" placeholder="Your Password">
~~~~

### JavaScript

~~~~javascript
$(document).ready(function(){
	$("#pwd").pwdMeasure();
});
~~~~


## Options
### minScore
最低限必要な強度を0~100のパーセントで指定します。  
**Default: `50`**  
**Type: `integer`**

### events
指定したイベントで強度判定を行います。  
**Default: `keyup change`**  
**Type: `string`**

### labels
強度を示すラベルを配列で指定します。  
**Type: `array`**  
**Default:**
~~~~javascript
[
	[10, "すごく弱い"],  //0~10%  = "すごく弱い"
	[30, "弱い"],       //11~30%  = "弱い"
	[60, "平均"],       //31~60%  = "平均"
	[100, "強い"] //61~100%  = "強い"
]
~~~~

### indicator
強度を示すラベルを表示する要素を指定します。  
**Type: `string | jQueryObj | DOM Elements`**  
**Default: `#pm-indicator`**

### indicatorTemplate
強度を示すラベルを表示する`<%= キー %>`形式で指定します。  
使用できるキーは下記です。

* label
* percentage

**Type: `string | jQueryObj | DOM Elements`**  
**Default: `パスワード強度: <%= label => (<%= percentage %>%)`**

### confirm
確認用のフィールドを指定します。確認用フィールドを指定することで、
パスワードが一致しているかどうかの判定も行ないます。  
**Type: `string | jQueryObj | DOM Elements`**  
**Default: `false`**

### notMatch
メインの入力フィールドと、確認用フィールドの値が一致しない場合のラベルを指定します。  
このオプションは`confirm`に指定が無い場合は無効です。  
**Type: `string`**  
**Default: `不一致`**


## Callbacks
### onValid
強度が`minScore`の値を上回ったらコールされます。  
**Default: `false`**  
**Type: `function`**

### onInvalid
強度が`minScore`の値を上回った後、再び`minScore`よりも低い値になった際にコールされます。  
**Default: `false`**  
**Type: `function`**

### onChanged
パスワードの値が変更される度にコールされます。  
**Default: `false`**  
**Type: `function`**

### onOptionEvent
`events`オプションで指定したイベントが呼び出される度にコールされます。  
**Default: `false`**  
**Type: `function`**



## Requirements
jQuery 1.7.2 +


## Licence
Released under the [MIT Licence](https://github.com/tcnksm/tool/blob/master/LICENCE)


## Author
[tsuyoshi wada](https://github.com/tsuyoshiwada/)
