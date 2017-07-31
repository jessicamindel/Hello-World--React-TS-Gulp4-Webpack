var path = require("path");

var config = {
    entry: ["./src/index.tsx"],

    output: {
        path: path.resolve(__dirname, "build/js"),
        filename: "bundle.js"
    },

    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx", ".css", ".scss", ".json"]
    },

    devtool: "source-map",

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                include: [
                    path.resolve(__dirname, "src")
                ],
                use: [ 
                    // {
                    //     loader: "babel-loader",
                    //     options: {
                    //         presets: ["es2015"] // Might need to change this...
                    //     }
                    // }
                    { loader: "awesome-typescript-loader" }
                    // TODO: Add .babelrc to take care of transpiling more fully, and set options as per https://github.com/s-panferov/awesome-typescript-loader
                ]
            },
            {
                test: /\.json$/,
                include: [
                    path.resolve(__dirname, "src")
                ],
                use: [
                    { loader: "json-loader" }
                ]
            },
            {
                test: /\.scss$/,
                include: [
                    path.resolve(__dirname, "src")
                ],
                use: [
                    { loader: "style-loader" },
                    {
                        loader: "typings-for-css-modules-loader",
                        options: {
                            namedExport: true,
                            camelCase: true,
                            sourceMap: true,
                            modules: true
                        }
                    },
                    {
                        loader: "pleeease-loader",
                        options: {
                            minifier: false
                        }
                    },
                    { loader: "sass-loader" }
                ]
            }
        ]
    }
};

module.exports = config;