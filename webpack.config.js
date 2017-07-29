var path = require("path");

var config = {
    entry: ["./src/processed/index.js"],

    output: {
        path: path.resolve(__dirname, "build/js"),
        filename: "bundle.js"
    },

    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },

    devtool: "source-map",

    module: {
        rules: [
            {
                test: /\.js$/,
                include: [
                    path.resolve(__dirname, "src/raw")
                ],
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["es2015"] // Might need to change this...
                    }
                }
            },
            {
                test: /\.json$/,
                include: [
                    path.resolve(__dirname, "src/raw")
                ],
                use: {
                    loader: "json-loader"
                }
            },
            {
                test: /\.css$/,
                include: [
                    path.resolve(__dirname, "src/processed")
                ],
                use: [
                    { loader: "style-loader" },
                    { loader: "css-loader" }
                ]
            }
        ]
    }
};

module.exports = config;