define(["require", "exports", "react", "./presets.json", "../styles.css"], function (require, exports, React, presets_json_1, styles) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    console.log(styles);
    var GreetingPreset;
    (function (GreetingPreset) {
        GreetingPreset["hello"] = "hello";
        GreetingPreset["goodbye"] = "goodbye";
        GreetingPreset["hey"] = "hey";
    })(GreetingPreset = exports.GreetingPreset || (exports.GreetingPreset = {}));
    let greetStyleMap = new Map();
    greetStyleMap.set(GreetingPreset.hello, styles.greetingHello);
    greetStyleMap.set(GreetingPreset.goodbye, styles.greetingGoodbye);
    greetStyleMap.set(GreetingPreset.hey, styles.greetingHey);
    class Greeting extends React.Component {
        constructor(props) {
            super(props);
        }
        render() {
            let greetName = this.props.greeting.toString();
            let greetText = presets_json_1.default[greetName];
            let s = greetStyleMap.get(this.props.greeting);
            return (React.createElement("div", { className: s }, greetText));
        }
    }
    exports.Greeting = Greeting;
});
