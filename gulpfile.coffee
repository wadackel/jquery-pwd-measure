gulp = require("gulp")
$ = do require("gulp-load-plugins")
del = require("del")
runSequence = require("run-sequence")




# ========================================================
# Core
# ========================================================

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




# ========================================================
# Demo
# ========================================================

gulp.task("demo:jade", ->
  gulp.src([
    "./demo/jade/**/*.jade"
    "!./demo/jade/**/_*.jade"
  ])
  .pipe($.plumber())
  .pipe($.jade(pretty: true))
  .pipe(gulp.dest("./demo/"))
)


gulp.task("demo:sass", ->
  gulp.src("./demo/sass/**/*.scss")
  .pipe($.plumber())
  .pipe($.sass.sync(outputStyle: "compressed"))
  .pipe($.autoprefixer())
  .pipe(gulp.dest("./demo/css"))
)


gulp.task("demo:watch", ["demo:sass", "demo:jade"], ->
  gulp.watch("./demo/sass/**/*", ["demo:sass"]);
  gulp.watch("./demo/jade/**/*", ["demo:jade"]);
)


gulp.task("demo:build", (cb) ->
  runSequence(
    ["demo:jade", "demo:sass"],
    cb
  )
)
