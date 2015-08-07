gulp = require("gulp")
$ = do require("gulp-load-plugins")
del = require("del")
runSequence = require("run-sequence")


# jshint
gulp.task("jshint", ->
  gulp.src("./jquery.pwdMeasure.js")
  .pipe($.jshint())
  .pipe($.jshint.reporter("jshint-stylish"))
)


# compile
gulp.task("compile", ->
  gulp.src("./jquery.pwdMeasure.js")
  .pipe($.plumber())
  .pipe($.uglify(preserveComments: "some"))
  .pipe($.rename(extname: ".min.js"))
  .pipe(gulp.dest("./"))
)


# test
gulp.task("test", ->
  gulp.src("./test/index.html")
  .pipe($.qunit(timeout: 5))
)


# watch
gulp.task("watch", ->
  gulp.watch("./jquery.pwdMeasure.js", ["compile", "jshint"])
  gulp.watch("./test/tests.js", ["test"])
)


# default
gulp.task("default", ->
  gulp.start("watch")
)


# build
gulp.task("build", (cb) ->
  runSequence(
    "jshint",
    "compile",
    "test",
    cb
  )
)
