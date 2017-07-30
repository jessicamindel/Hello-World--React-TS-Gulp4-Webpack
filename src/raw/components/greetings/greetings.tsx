import * as React from "react";
import greetings from "./presets.json";
import * as styles from "../styles.css";

console.log(styles);

export interface IGreetingProps {
    //greeting: "hello" | "goodbye" | "hey";
    greeting: GreetingPreset;
}

export enum GreetingPreset {
    hello = "hello",
    goodbye = "goodbye",
    hey = "hey"
}

let greetStyleMap = new Map<GreetingPreset, string>();
greetStyleMap.set(GreetingPreset.hello, styles.greetingHello);
greetStyleMap.set(GreetingPreset.goodbye, styles.greetingGoodbye);
greetStyleMap.set(GreetingPreset.hey, styles.greetingHey);

export class Greeting extends React.Component<IGreetingProps, {}> {
    constructor(props: IGreetingProps) {
        super(props);
    }

    public render() {
        let greetName = this.props.greeting.toString();
        let greetText = greetings[greetName];
        let s = greetStyleMap.get(this.props.greeting);

        return (
            <div className={s}>{greetText}</div>
        );
    }
}