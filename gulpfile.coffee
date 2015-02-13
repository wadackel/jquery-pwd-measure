# require modules
gulp = require "gulp"
$ = do require "gulp-load-plugins"
rm = require "rimraf"
browserSync = require "browser-sync"


# variables
pkg = require "./package.json"
banner = [
  "/*!"
  " * <%= pkg.name %>"
  " * <%= pkg.description %>"
  " * @version <%= pkg.version %>"
  " * @author <%= pkg.author %>"
  " * @license <%= pkg.license %>"
  " */"
].join "\n"

pkg.jshintConfig.lookup = false

path = {
  src: "./src"
  dist: "./"
  examples: "./examples"
}


# jshint
gulp.task "jshint", ->
  gulp.src path.src + "/*.js"
  .pipe $.jshint(pkg.jshintConfig)
  .pipe $.jshint.reporter "default"


# compile
gulp.task "compile", ->
  gulp.src path.src + "/*.js"
  .pipe $.plumber()
  .pipe $.header(banner, {pkg: pkg})
  .pipe gulp.dest path.dist
  .pipe gulp.dest path.examples + "/js"
  .pipe $.uglify({preserveComments: "some"})
  .pipe $.rename({extname: ".min.js"})
  .pipe gulp.dest path.dist
  .pipe browserSync.reload({stream: true})


# browser sync
gulp.task "bs", ->
  browserSync({
    notify: false
    server: {
      baseDir: path.examples + "/"
    }
  })

gulp.task "bs-reload", ->
  browserSync.reload()


# watch
gulp.task "watch", ["bs","compile"], ->
  gulp.watch path.examples + "/*.html", ["bs-reload"]
  gulp.watch path.src + "/*.js", ["compile"]


# default
gulp.task "default", ->
  gulp.run "watch"


# build
gulp.task "build", ["jshint"], ->
  gulp.run "compile"

