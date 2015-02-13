jQuery.pwdMeasure
================


## Version
1.0.1


## Description
パスワードの強度を測定するjQueryプラグインです。


## Demo
[http://webdesign-dackel.com/dev/pwd-measure/](http://webdesign-dackel.com/dev/pwd-measure/)


## Features
pwdMeasureの特徴は下記のとおりです。

* パスワードの強度をパーセント表示可能
* 単一の入力フィールド、確認フィールドへの対応
* 強度を示すラベルを詳細に設定可能
* 必要最低限のパスワード強度をパーセント指定可能
* 判定をクリアした時、値が変わった時などのコールバックをサポート



## How To Use

### Bower

```
$ bower install jquery-pwd-measure
```

### Install

```html
<script type="text/javascript" src="//code.jquery.com/jquery-1.11.2.min.js"></script>
<script type="text/javascript" src="js/jquery.pwdMeasure.min.js"></script>
```

### HTML

```html
<input type="password" id="pwd" name="pwd" value="" placeholder="Your Password">
<p id="pm-indicator"></p>
```

### JavaScript

```javascript
$(document).ready(function(){
	$("#pwd").pwdMeasure();
});
```


## Options
### minScore
最低限必要な強度を0~100のパーセントで指定します。  
**Default: `50`**  
**Type: `integer`**

### minLength
最低限必要な文字数を指定します。  
ここで指定した文字数と`minScore`の値から入力されたパスワードの強度を求めます。  
**Default: `6`**  
**Type: `integer`**

### events
指定したイベントで強度判定を行います。  
**Default: `keyup change`**  
**Type: `string`**

### labels
強度を示すラベルを配列で指定します。  
**Type: `array`**  
**Default:**

```javascript
[
  {score:10,         label:"とても弱い", class:"very-weak"},   //0~10%
  {score:30,         label:"弱い",       class:"weak"},        //11~30%
  {score:50,         label:"平均",       class:"average"},     //31~50%
  {score:70,         label:"強い",       class:"strong"},      //51~70%
  {score:100,        label:"とても強い", class:"very-strong"}, //71~100%
  {score:"notMatch", label:"不一致",     class:"not-match"},   //not match
  {score:"empty",    label:"未入力",     class:"empty"}        //empty
]
```

キーに対応する役割は下記のとおりです。
`indicator`オプションを指定した場合、自動的にラベル、クラスが適用されます。  
また、コールバック内で取得出来ます。

* `score`: 該当する範囲をパーセント(整数)指定 `0~100` or `"notMatch"`
* `label`: 対応するラベル `string`
* `class`: 対応するクラス名 `string`

`score`には例外が存在します。それぞれのルールは下記のとおりです。

| key           | rule                                                      |
| :------------ | :-------------------------------------------------------- |
| `"notMatch"`  | メイン、確認用フィールドの値が違う場合                    |
| `"empty"`     | メイン、確認用フィールドのどちらも空の場合                |



### indicator
強度を示すラベルを表示する要素を指定します。  
**Type: `string | jQueryObj | DOM Elements`**  
**Default: `#pm-indicator`**

### indicatorTemplate
強度を示すラベルを表示する`<%= キー %>`形式で指定します。  
使用できるキーは下記です。

* label
* class
* percentage

**Type: `string | jQueryObj | DOM Elements`**  
**Default: `パスワード強度: <%= label %> (<%= percentage %>%)`**

### confirm
確認用のフィールドを指定します。確認用フィールドを指定することで、
パスワードが一致しているかどうかの判定も行ないます。  
**Type: `string | jQueryObj | DOM Elements`**  
**Default: `false`**


## Callbacks
### onValid
強度が`minScore`の値を上回ったらコールされます。  
**Default: `false`**  
**Type: `function`**

### onInvalid
強度が`minScore`の値を上回った後、再び`minScore`よりも低い値になった際にコールされます。  
**Default: `false`**  
**Type: `function`**

### onNotMatch
メインの入力フィールドと、確認用フィールドの値が異なる際にコールされます。  
毎回のイベント時に呼ばれるのでは無く、内部的なステータス値が変更されたタイミングを採用します。  
**Default: `false`**  
**Type: `function`**

### onEmpty
メインの入力フィールドと、確認用フィールドのどちらも値が空の時コールされます。  
**Default: `false`**  
**Type: `function`**

### onChangeState
`onValid`, `onInvalid`, `onNotMatch`のタイミングでコールされます。  
**Default: `false`**  
**Type: `function`**

### onChangeValue
パスワードの値が変更される度にコールされます。  
※実際の値の変化では無く、`events`オプションで指定したイベント実行の度にコールされます。  
**Default: `false`**  
**Type: `function`**


## Requirements
jQuery 1.7.2 +


## Licence
Released under the [MIT Licence](https://github.com/tsuyoshiwada/jQuery.pwdMeasure/blob/master/LICENCE)


## Author
[tsuyoshi wada](https://github.com/tsuyoshiwada/)
