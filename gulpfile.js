/** 
 * @file The gulpfile for this project.
 * @author Jessie Mindel
 * @version 2.0
*/

var gulp = require("gulp");
var webpack = require("webpack");
var argv = require("yargs").argv;
var plugins = {
    webpackStream:  require("webpack-stream"),
    browserSync:    require("browser-sync")
};
var globs = {
    src: "./src/",
    entry: "./src/index.tsx",
    build: "./build",
    wpBuild: "./build/js/",
    sass: "./src/**/*.scss",
    ts: ["src/**/*.ts", "src/**/*.tsx"],
    json: "./src/**/*.json"
};

/**
 * @name webpack
 * @desc Bundles everything with Webpack. Transpiles TS, processes SCSS (and adds TS types for it), and bundles JSON.
 */
var task_webpack = gulp.task("webpack", function() {
    return gulp.src(globs.entry)
        .pipe(plugins.webpackStream(require("./webpack.config.js"), webpack))
        .pipe(gulp.dest(globs.wpBuild));
});

// Starts browsersync's live dev server.
function startBS() {
    plugins.browserSync.init({
        server: {
            baseDir: "./build/",
            index: "./index.html"
        }
    });
}

var task_bsReload = gulp.task("bs-reload", gulp.series("webpack", function(cb) {
    plugins.browserSync.reload();
    cb();
}));

/**
 * @name live-dev
 * @desc Starts the browsersync livereload server.
 */
var task_liveDev = gulp.task("live-dev", function() {
    startBS();
    var watch_ts = gulp.watch(globs.ts, gulp.series("bs-reload"));
    var watch_json = gulp.watch(globs.json, gulp.series("bs-relaod"));
    var watch_sass = gulp.watch(globs.sass, gulp.series("bs-reload"));
});