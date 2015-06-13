function commonBeforeEach(){
  this.$fixture = $("#qunit-fixture").append([
    '<input type="password" id="pm-input">',
    '<div id="pm-indicator"></div>'
  ].join("\n"));

  this.$el = $("#pm-input", this.$fixture);
}


QUnit.module("Core", {
  beforeEach: commonBeforeEach
})


QUnit.test("should be chainable", function(assert){
  assert.strictEqual(this.$el.pwdMeasure(), this.$el);
});


QUnit.test("should be return the appropriate label depending on the value of the input field", function(assert){
  var $el = this.$el.pwdMeasure(),
      pwdMeasure = $el.data("pwdMeasure"),
      trigger = "change.pm";

  // empty
  assert.strictEqual(pwdMeasure.getLabelObj().className, "empty", "empty");

  // very-weak
  $el.val("G").trigger(trigger);
  assert.strictEqual(pwdMeasure.getLabelObj().className, "very-weak", "very-weak");

  // weak
  $el.val("8471").trigger(trigger);
  assert.strictEqual(pwdMeasure.getLabelObj().className, "weak", "weak");

  // average
  $el.val("g8ediz").trigger(trigger);
  assert.strictEqual(pwdMeasure.getLabelObj().className, "average", "average");

  // strong
  $el.val("Dh5Yy4v2").trigger(trigger);
  assert.strictEqual(pwdMeasure.getLabelObj().className, "strong", "strong");

  // very-strong
  $el.val("_Mm4qgLV!8").trigger(trigger);
  assert.strictEqual(pwdMeasure.getLabelObj().className, "very-strong", "very-strong");


  // And confirm.
  var $el2 = this.$fixture.append([
    '<input type="password" id="pm-input2">',
    '<input type="password" id="pm-input2-confirm">',
    '<div id="pm-indicator2"></div>'
  ].join("\n")).find("#pm-input2");

  var pwdMeasure2 = $el2.pwdMeasure({
    confirm: "#pm-input2-confirm",
    indicator: "#pm-indicator2"
  }).data("pwdMeasure");

  // not-match
  $("#pm-input2").val("f7Jvbs5h");
  $("#pm-input2-confirm").val("lkdQQ_").trigger(trigger);

  assert.strictEqual(pwdMeasure2.getLabelObj().className, "not-match", "not-match");

  // strong and matched.
  $("#pm-input2").val("f7Jvbs5h");
  $("#pm-input2-confirm").val("f7Jvbs5h").trigger(trigger);

  assert.strictEqual(pwdMeasure2.getLabelObj().className, "strong", "strong");
});


QUnit.test("should state is updated in the specified events", function(assert){
  var $el = this.$el.pwdMeasure({
    events: "change"
  });
  var pwdMeasure = this.$el.data("pwdMeasure");

  // Not updated.
  $el.val("n4SfE3uV").trigger("keyup");
  $el.val("n4SfE3uV").trigger("keydown");
  $el.val("n4SfE3uV").trigger("blur");
  assert.strictEqual(pwdMeasure.getLabelObj().className, "empty", "Not updated");

  // It is updated. (only `change` event)
  $el.val("n4SfE3uV").trigger("change");
  assert.strictEqual(pwdMeasure.getLabelObj().className, "strong", "It is updated");
});


QUnit.test("it should return the appropriate call back", function(assert){
  var done = {
    valid      : assert.async(),
    invalid    : assert.async(),
    notMatch   : assert.async(),
    empty      : assert.async(),
    changeState: assert.async(),
    changeValue: assert.async()
  };

  var counter = {
    onChangeState: 0,
    onChangeValue: 0
  };

  this.$fixture.append([
    '<input type="password" id="pm-input2">',
    '<input type="password" id="pm-input2-confirm">',
    '<div id="pm-indicator2"></div>'
  ].join("\n"));

  var $elConfirm = $("#pm-input2-confirm");
  var $el;
  $el = $("#pm-input2").pwdMeasure({
    minScore: 50,
    minLength: 6,
    confirm  : "#pm-input2-confirm",
    indicator: "#pm-indicator2",

    onValid : function(percentage, label, className){
      assert.ok(percentage >= 50, "Score is higher than the 50");
      assert.ok($(this).val().length >= 6, "Number of characters is higher than the 6");
      done.valid();
    },
    onInvalid : function(percentage, label, className){
      assert.ok(percentage < 50, "Score 50 or less");
      done.invalid();
    },
    onNotMatch : function(percentage, label, className){
      assert.notEqual($(this).val(), $elConfirm.val(), "Input values are different in the main and confirmation");
      done.notMatch();
    },
    onEmpty : function(percentage, label, className){
      assert.strictEqual($(this).val(), "", "Main field is empty");
      assert.strictEqual($elConfirm.val(), "", "Confirmation field is empty");
      done.empty();
    },
    onChangeState: function(percentage, label, className, type){
      if( counter.onChangeState === 0 ) done.changeState();
      counter.onChangeState++;
    },
    onChangeValue: function(percentage, label, className){
      if( counter.onChangeValue === 0 ) done.changeValue();
      counter.onChangeValue++;
    }
  });


  // invalid
  $el.val("1234").trigger("change");

  // not match
  $elConfirm.val("jau1@_912").trigger("keyup");

  // valid
  $el.val("z6HacYsr");
  $elConfirm.val("z6HacYsr").trigger("keyup");
});
