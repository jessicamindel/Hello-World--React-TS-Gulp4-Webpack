I'm currently working on a project that should in theory be rather simple: a run-of-the-mill "hello world" in React with TypeScript. It should render three `<Greeting>` tags, each of which takes a different parameter value: `greeting={"hi" | "hello" | "hey"}` (I've achieved this using an enum), based on which it displays a different greeting that it loads from a JSON file.

However, the workflow (building and bundling) that I've set up has grown to be quite complex. I've chosen to use Gulp with Webpack, and would like to make my JavaScript and CSS files modular. My setup works something like this:

**File structure:**
```
/build
    /js
    index.html
/node_modules
/src
    /processed
    /raw
        /components
            /greetings
                greetings.tsx
                presets.json
            _test.scss
            styles.css.d.ts
            styles.scss
        index.tsx
gulpfile.js
package.json
tsconfig.json
typings.d.ts
webpack.config.js
```

**Gulp tasks:**

- Build and bundle
    1. Copy any JSON files from `./src/raw/` into `./src/processed/**` (in the same structure that they were found in in `./src/raw/`).
    2. Preprocess and postprocess any SCSS files in `./src/raw/` and place them into their respective structure in `./src/processed/`, as with the JSON files.
    3. Generate TypeScript declaration files for the processed CSS files, and place those into their respective directories in `./src/raw/`. This is done so that any TypeScript files in that same folder may import the CSS styles and use them in a local scope. (You can see the result of this in `./src/raw/components/styles.css.d.ts`.)
        - This is done with CSS files and not SCSS files because once the TypeScript is transpiled and placed into the `./src/processed/` folder, the files with which it is bundled will indeed by processed CSS files, and not the raw SCSS files.
    4. Transpile TypeScript files, first using the built-in TypeScript transpiler to transpile to ESNEXT. Place the resulting JS (not JSX--that's already been transpiled) files into their respective directories in `./src/processed/`.
    5. Run Webpack (still through Gulp).
        - Load JS files from `./src/processed/` using `babel-loader`, with the `es2015` preset. Use `./src/processed/index.js` as the entry point.
        - Load JSON files from `./src/processed/` using `json-loader`.
        - Load CSS files from `./src/processed/` using `style-loader` and `css-loader`.
        - Currently, there is no chunking, and only one file is produced, including vendor contents.
- Run
    1. Start up a browsersync server with livereload enabled.
    2. Watch for changes in TypeScript and JSON files in `./src/raw/`. If a change occurs, rebuild and rebundle the application, and reload the server.
    3. Watch for changes in SCSS files in `./src/raw/`. If a change occurs, rebuild only the CSS code, and stream it to the server rather than reloading.

Before attempting to integrate my CSS code into Webpack, I instead used to use Gulp to send the CSS files directly to `./build/css/`, and then use a `<link>` to reference them in my HTML file. However, I wanted the CSS to be modular and have local scope, so I thought I'd give Webpack a go for more than just JavaScript.

**My questions:**
- Currently, the CSS is successfully being loaded into my Webpack bundle, but `./src/processed/components/greetings/greetings.js` cannot successfully import the styles. Whenever I import them from `./src/processed/components/styles.css`, the resulting object is empty. Why is this happening, and how can I fix it?

- One thing I've noticed when debugging with sourcemaps via Webpack on the browsersync server is that `./src/processed/components/styles.css` looks like a set of strings of text with some exports rather than a CSS file. Furthermore, the CSS styles that result seem to be of global scope rather than being local to `./src/processed/components/greetings/greetings.tsx`. Is this normal? How can I fix this, if it should be fixed?

- Should my CSS be stored in a different chunk if I continue to use Webpack? I've looked into [separating CSS using this Webpack plugin](https://survivejs.com/webpack/styling/separating-css/), but have yet to try it, because I'm not sure if it would at all solve the problem.

- Is Gulp at all the right tool to use? I originally was interested in it because of the flexibility it offers, and because a lot of the setup is simpler than it is with Webpack (I also prefer Gulp's syntax to that of Webpack's configuration file). And would I be better off going with Browserify than Webpack? This _is_ a simple, small project, but I plan to reuse this workflow as boilerplate in larger future projects. I've heard that Gulp is very scalable because it's a task runner and not a bundler, but I do need a bundler.

- If I continue to use Webpack, what should it be responsible for, and what should Gulp be responsible for? Should I use Webpack for all transpiling, processing, and loading, and perhaps use Gulp eventually for unit tests and anything else I may need? Or should Gulp continue to be at the core of my workflow?