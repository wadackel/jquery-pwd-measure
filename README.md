jquery-pwd-measure
================

[![Build Status](https://travis-ci.org/tsuyoshiwada/jquery-pwd-measure.svg?branch=master)](https://travis-ci.org/tsuyoshiwada/jquery-pwd-measure)


## Version
1.0.4


## Description
パスワードの強度を測定して表示するためのjQueryプラグインです。


## Demo
準備中


## Features
PwdMeasureの特徴は下記のとおりです。

* パスワードの強度をパーセント表示可能
* 単一の入力フィールド、確認フィールドへの対応
* 強度を示すラベルを詳細に設定可能
* 必要最低限のパスワード強度をパーセント指定可能
* 判定をクリアした時、値が変わった時などのコールバックをサポート
* スタイルシートで自由にデザインを変更可能



## How To Use

### Bower

```
$ bower install jquery-pwd-measure --save
```

### NPM

```
$ npm install jquery-pwd-measure --save
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

### Defaults

```javascript
// Default Options
{
  minScore: 50,
  minLength: 6,
  events: "keyup change",
  labels: [
    {score:10,         label:"とても弱い", className:"very-weak"},   //0~10%
    {score:30,         label:"弱い",       className:"weak"},        //11~30%
    {score:50,         label:"平均",       className:"average"},     //31~50%
    {score:70,         label:"強い",       className:"strong"},      //51~70%
    {score:100,        label:"とても強い", className:"very-strong"}, //71~100%
    {score:"notMatch", label:"不一致",     className:"not-match"},   //not match
    {score:"empty",    label:"未入力",     className:"empty"}        //empty
  ], 
  indicator: "#pm-indicator",
  indicatorTemplate: "パスワード強度: <%= label %> (<%= percentage %>%)",
  confirm: false,

  // Callbacks
  onValid: false,
  onInvalid: false,
  onNotMatch: false,
  onEmpty: false,
  onChangeState: false,
  onChangeValue: false
}
```


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
  {score:10,         label:"とても弱い", className:"very-weak"},   //0~10%
  {score:30,         label:"弱い",       className:"weak"},        //11~30%
  {score:50,         label:"平均",       className:"average"},     //31~50%
  {score:70,         label:"強い",       className:"strong"},      //51~70%
  {score:100,        label:"とても強い", className:"very-strong"}, //71~100%
  {score:"notMatch", label:"不一致",     className:"not-match"},   //not match
  {score:"empty",    label:"未入力",     className:"empty"}        //empty
]
```

キーに対応する役割は下記のとおりです。
`indicator`オプションを指定した場合、自動的にラベル、クラスが適用されます。  
また、コールバック内で取得出来ます。

* `score`: 該当する範囲をパーセント(整数)指定 `0~100` or `"notMatch"`
* `label`: 対応するラベル `string`
* `className`: 対応するクラス名 `string`

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

* `label`
* `className`
* `percentage`

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


## Dependencies
jQuery 1.7.2 +


## TODO
以下、優先順位順。

1. テストを書く
2. デモページの移行 (Github上に作成)
3. コールバックとは別にイベントを提供する
4. 文字列から、強度を測定するグローバルAPIを提供
5. CSSのテーマを作成 (オプションで選択できるようにする予定)


## Licence
Released under the [MIT Licence](https://github.com/tsuyoshiwada/jQuery.pwdMeasure/blob/master/LICENCE)


## Author
[tsuyoshi wada](https://github.com/tsuyoshiwada/)
