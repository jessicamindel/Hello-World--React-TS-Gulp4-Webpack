var path = require("path");

var config = {
    //entry: ["./src/index.tsx"],
    // Literal sorcery. https://github.com/webpack/webpack/issues/1189
    entry: {
        "build/helloWorld/bundle": "./src/helloWorld/index.tsx",
        "build/activityCounter/bundle": "./src/activityCounter/index.tsx"
    },

    output: {
        path: path.resolve(__dirname), //path.resolve(__dirname, "build"),
        filename: "[name].js" //"bundle.js"
    },

    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx", ".css", ".scss", ".json"]
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                include: [
                    path.resolve(__dirname, "src")
                ],
                use: [ 
                    { loader: "babel-loader" },
                    { loader: "awesome-typescript-loader" }
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
    },

    plugins: [],
};

module.exports = config;