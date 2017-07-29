import * as React from "react";
import * as ReactDOM from "react-dom";
import { Greeting } from "./components/greetings/greetings";
const root = document.getElementById("react-container");
ReactDOM.render(React.createElement("div", null,
    React.createElement(Greeting, { greeting: "hello" }),
    React.createElement("br", null),
    React.createElement(Greeting, { greeting: "goodbye" }),
    React.createElement("br", null),
    React.createElement(Greeting, { greeting: "hey" })), root);
