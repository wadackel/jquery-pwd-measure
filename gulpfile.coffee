gulp = require("gulp")
$ = do require("gulp-load-plugins")
del = require("del")
runSequence = require("run-sequence")
pkg = require("./package.json")

files = 
  src : "./jquery.pwdMeasure.js"
  test: "./test/index.html"
  testJs: "./test/tests.js"



# jshint
gulp.task("jshint", ->
  gulp.src(files.src)
  .pipe($.jshint(pkg.jshintConfig))
  .pipe($.jshint.reporter("default"))
)

# compile
gulp.task("compile", ->
  gulp.src(files.src)
  .pipe($.plumber())
  .pipe($.uglify(preserveComments: "some"))
  .pipe($.rename(extname: ".min.js"))
  .pipe(gulp.dest("./"))
)

# test
gulp.task("test", ->
  gulp.src(files.test)
  .pipe($.qunit(timeout: 5))
)

# watch
gulp.task("watch", ->
  gulp.watch(files.src, ["compile"])
  gulp.watch(files.testJs, ["test"])
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
