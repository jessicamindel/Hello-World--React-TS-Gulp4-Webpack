define(["require", "exports", "react", "react-dom", "./components/greetings/greetings"], function (require, exports, React, ReactDOM, greetings_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const root = document.getElementById("react-container");
    ReactDOM.render(React.createElement("div", null,
        React.createElement(greetings_1.Greeting, { greeting: greetings_1.GreetingPreset.hello }),
        React.createElement("br", null),
        React.createElement(greetings_1.Greeting, { greeting: greetings_1.GreetingPreset.goodbye }),
        React.createElement("br", null),
        React.createElement(greetings_1.Greeting, { greeting: greetings_1.GreetingPreset.hey })), root);
});
