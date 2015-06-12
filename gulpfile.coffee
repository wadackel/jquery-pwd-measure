gulp = require("gulp")
$ = do require("gulp-load-plugins")
rm = require("rimraf")
pkg = require("./package.json")
pkg.jshintConfig.lookup = false
filename = "./jquery.pwdMeasure.js"


# jshint
gulp.task("jshint", ->
  gulp.src(filename)
  .pipe($.jshint(pkg.jshintConfig))
  .pipe($.jshint.reporter("default"))
)

# compile
gulp.task("compile", ->
  gulp.src(filename)
  .pipe($.plumber())
  .pipe($.uglify(preserveComments: "some"))
  .pipe($.rename(extname: ".min.js"))
  .pipe(gulp.dest("./"))
)

# watch
gulp.task("watch", ->
  gulp.watch(filename, ["compile"])
)

# default
gulp.task("default", ->
  gulp.start("watch")
)

# build
gulp.task("build", ["jshint"], ->
  gulp.start("compile")
)
