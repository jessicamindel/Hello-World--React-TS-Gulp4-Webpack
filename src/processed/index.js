import * as React from "react";
import * as ReactDOM from "react-dom";
import { Greeting, GreetingPreset } from "./components/greetings/greetings";
const root = document.getElementById("react-container");
ReactDOM.render(React.createElement("div", null,
    React.createElement(Greeting, { greeting: GreetingPreset.hello }),
    React.createElement("br", null),
    React.createElement(Greeting, { greeting: GreetingPreset.goodbye }),
    React.createElement("br", null),
    React.createElement(Greeting, { greeting: GreetingPreset.hey })), root);
