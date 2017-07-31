/** 
 * @file The gulpfile for this project.
 * @author Jessie Mindel
 * @version 1.0
*/

var gulp = require("gulp");
var webpack = require("webpack");
var argv = require("yargs").argv;   // For flag inputs (works well when paired with gulp-if for changing the stream)
var plugins = {
    webpackStream:  require("webpack-stream"),
    ts:             require("gulp-typescript"),
    browserSync:    require("browser-sync").create(),
    clean:          require("gulp-clean"),
    changed:        require("gulp-changed"),
    rename:         require("gulp-rename"),
    sass:           require("gulp-sass"),
    pleeease:       require("gulp-pleeease"),
    tcm:            require("gulp-typed-css-modules")
};
var globs = {
    processed: "./src/processed/",
    raw: "./src/raw/",
    sass: ["./src/raw/**/*.scss", "!./src/raw/**/_*.scss"],
    ts: ["src/raw/**/*.ts", "src/raw/**/*.tsx"],
    json: "./src/raw/**/*.json",
    css: "./src/processed/**/*.css"
};

// =============================================================================
// BUILD - SCSS, CSS
// =============================================================================

/**
 * @name sass
 * @desc Preprocesses and postprocesses (autoprefixer, minification, etc.) SCSS and deposits it in the processed source directory.
 */
var task_sass = gulp.task("sass", function() {
    return gulp.src(globs.sass)
        .pipe(plugins.changed(globs.processed/*"./build/css/"*/))
        .pipe(plugins.sass().on("error", plugins.sass.logError))
        .pipe(plugins.pleeease({
            minifier: false
        }))
        /*.pipe(plugins.rename(function(path) {
            path.basename += ".min"; //= `${path.dirname}.min`;
            //path.dirname = "./";
            path.extname = ".css";
        }))*/
        .pipe(gulp.dest(globs.processed/*"./build/css/"*/))
        .pipe(plugins.browserSync.stream());
});

var task_tcm = gulp.task("tcm", function() {
    return gulp.src(globs.css)
        /*.pipe(plugins.rename(function(path) {
            var parts = path.basename.split(".");
            path.basename = parts[0];
        }))*/
        .pipe(plugins.tcm({
            camelCase: true
        }))
        .pipe(gulp.dest(globs.raw));
});

// =============================================================================
// BUILD - JS, TS, JSON, WEBPACK
// =============================================================================

var tsProject = plugins.ts.createProject("tsconfig.json");

/**
 * @name transpile
 * @desc Transpiles TS code to ESNEXT JS. Babel is used within the Webpack configuration as a loader (rather than the script-loader).
 */
var task_transpile = gulp.task("transpile", function() {
    var tsResult = gulp.src(globs.ts)
        .pipe(plugins.changed(globs.processed))
        .pipe(tsProject());

    return tsResult.js.pipe(gulp.dest(globs.processed));
});
// TODO: Implement gulp-changed (make sure it works at this point)

/**
 * @name webpack
 * @desc Transpiles ESNEXT JS from the processed source into ES5, and bundles all processed source files.
 */
var task_webpack = gulp.task("webpack", function() {
    return gulp.src("./src/processed/index.js")
        .pipe(plugins.webpackStream(require("./webpack.config.js"), webpack))
        .pipe(gulp.dest("./build/js/"));
});

// =============================================================================
// BUILD - FINAL STEPS
// =============================================================================

/**
 * @name copy-files
 * @desc Copies all fies that weren't transpiled from the raw source to the processed source directory. Currently only works with JSON files, since no other files need to be copied. This is done so that Webpack can bundle all of the processed files without looking through the raw source directory.
 */
var task_copyFiles = gulp.task("copy-files", function() {
    return gulp.src(globs.json)
        .pipe(gulp.dest(globs.processed));
});

/**
 * @name del-processed
 * @desc Removes the processed source directory. This is useful for saving space after building--using this for Git pushes might be a good idea.
 */
var task_delProcessed = gulp.task("del-processed", function() {
    return gulp.src(globs.processed, {read: false})
        .pipe(plugins.clean());
});

// The options for building--helpful for the flags.
const buildVariants = {
    ts:         "transpile",
    webpack:    "webpack",
    copy:       "copy-files",
    remove:     "del-processed",
    sass:       "sass"
};

/**
 * @name build
 * @desc Builds the raw source code using the given options. By default, it transpiles SCSS and TS, copies any files that aren't transpiled over to the processed source directory, and bundles it all with Webpack.
 * @param flag --remove Deletes the processed folder after it's been used.
 * @param flag -r Shorthand for the --remove flag.
 * @param flag --copy Determines whether files that are not transpiled (such as JSON, which doesn't need to be transpiled) should be copied over to the processed source directory.
 * @param flag --sass Preprocesses SCSS files from the raw source, and then postprocesses them and deposits them in the processed source directory. Does not produce a sourcemap.
 * @param flag --ts Transpiles TS from the raw source to ESNEXT, deposits them in the processed source directory, and then bundles the JS files with Webpack.
 */
var task_build = gulp.task("build", gulp.series(function(cb) {
    var choices = [];
    
    // Order matters here!
    if (argv.copy)  { choices.push(buildVariants.copy); }
    if (argv.sass)  { choices.push(buildVariants.sass); }
    if (argv.ts)    { choices.push(buildVariants.ts, buildVariants.webpack); }

    if (!argv.ts && !argv.sass && !argv.copy) {
        choices.push(buildVariants.copy, buildVariants.ts, buildVariants.sass, buildVariants.webpack);
    }

    if (argv.r || argv.remove) { choices.push(buildVariants.remove); }

    gulp.series(choices)(cb);
}));

// =============================================================================
// DEVELOPMENT SERVER
// =============================================================================

// Starts browsersync's live dev server.
function startBS() {
    plugins.browserSync.init({
        server: {
            baseDir: "./build/",
            index: "./index.html"
        }
    });
}

/**
 * @name ts-bs-reload
 * @desc Reloads the browsersync (bs) server after building the raw source.
 */
var task_tsBsReload = gulp.task("ts-bs-reload", gulp.series("build", function(cb) {
    plugins.browserSync.reload();
    cb();
}));

/**
 * @name live-dev
 * @desc Starts the browsersync livereload server.
 */
var task_liveDev = gulp.task("live-dev", function() {
    startBS();
    var watch_ts = gulp.watch(globs.ts.concat(globs.json), gulp.series("ts-bs-reload"));
    var watch_sass = gulp.watch(globs.sass, gulp.series("sass"));
});

// =============================================================================
// OTHER
// =============================================================================

/**
 * @name default
 * @desc The default gulp task. Builds and bundles the raw source, and then starts up the livereload dev server.
 */
var task_default = gulp.task("default", gulp.series("build", "live-dev"));