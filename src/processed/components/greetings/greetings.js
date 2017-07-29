import * as React from "react";
import greetings from "./presets.json";
import * as styles from "../styles.css";
console.log(styles);
export var GreetingPreset;
(function (GreetingPreset) {
    GreetingPreset[GreetingPreset["hello"] = 0] = "hello";
    GreetingPreset[GreetingPreset["goodbye"] = 1] = "goodbye";
    GreetingPreset[GreetingPreset["hey"] = 2] = "hey";
})(GreetingPreset || (GreetingPreset = {}));
let greetStyleMap = new Map();
greetStyleMap.set(GreetingPreset.hello, styles.greetingHello);
greetStyleMap.set(GreetingPreset.goodbye, styles.greetingGoodbye);
greetStyleMap.set(GreetingPreset.hey, styles.greetingHey);
export class Greeting extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        let greetName = this.props.greeting.toString();
        let greetText = greetings[greetName];
        let s = greetStyleMap.get(this.props.greeting);
        return (React.createElement("div", { className: s }, greetText));
    }
}
