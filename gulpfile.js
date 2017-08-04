/** 
 * @file The gulpfile for this project.
 * @author Jessie Mindel
 * @version 2.0
*/

// =============================================================================
// IMPORTS AND CONFIG OBJECTS
// =============================================================================

// region Gulp objects
    var gulp = require("gulp");
    var argv = require("yargs").argv;

    var plugins = {
        gutil: require("gulp-util")
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
// endregion

// region Webpack objects
    var wp = {
        webpack:            require("webpack"),
        WebpackDevServer:   require("webpack-dev-server"),
        dev: {
            port: 9000,
            directory: "build/activityCounter/"
        },
        config: {
            raw:    require("./webpack.config.js"),
            rawObj: {}, prod: {}, dev: {}, server: {}
        }
    };

    wp.config.rawObj =  Object.create(wp.config.raw);
    wp.config.prod =    (function(raw) {
                            var myConfig = Object.create(raw);
                            myConfig.plugins = myConfig.plugins.concat(
                                new wp.webpack.DefinePlugin({
                                    "process.env": {
                                        // This has effect on the react lib size
                                        "NODE_ENV": JSON.stringify("production")
                                    }
                                }),
                                new wp.webpack.optimize.UglifyJsPlugin()
                            );
                            return myConfig;
                        })(wp.config.raw);
    wp.config.dev =     (function(raw) {
                            var myConfig = Object.create(raw);
                            myConfig.devtool = "source-map";
                            return myConfig;
                        })(wp.config.raw);
    wp.config.server =  (function(dev) {
                            var myConfig = Object.create(dev);
                            myConfig.devServer = {
                                contentBase: "./build/",
                                hot: true,
                                inline: true,
                                port: wp.devPort
                            };
                            return myConfig;
                        })(wp.config.dev);
// endregion

// =============================================================================
// TASKS :: WEBPACK
// =============================================================================

gulp.task("webpack:build", function(cb) {
    var chosenConfig = wp.config.rawObj;

    if (argv.d || argv.dev || argv.config == "d" || argv.config == "dev" || argv.c == "d" || argv.c == "dev") {
        chosenConfig = wp.config.dev;
    }
    else {
        chosenConfig = wp.config.prod;
    }

    wp.webpack(chosenConfig, function(err, stats) {
        if (err) throw new plugins.gutil.PluginError("webpack:build", err);
        plugins.gutil.log("[webpack:build]", stats.toString({
            colors: true
        }));
        cb();
    });
});

gulp.task("wb", gulp.series("webpack:build"));

gulp.task("webpack:server", function(cb) {
    var chosenConfig = wp.config.server; // Includes dev server config
    var server = new wp.WebpackDevServer(wp.webpack(chosenConfig));
    var dir = (argv.sitemap) ? "" : ((argv.dir && typeof argv.dir == "string") ? argv.dir : wp.dev.directory);
    server.listen(wp.dev.port, "localhost", function(err) {
            if(err) throw new plugins.gutil.PluginError("webpack-dev-server", err);
            plugins.gutil.log("[webpack:server]", `http://localhost:${wp.dev.port}/webpack-dev-server/${dir}`);
    });
});

gulp.task("ws", gulp.series("webpack:server"));