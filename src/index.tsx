import * as React from "react";
import * as ReactDOM from "react-dom";
import { Greeting, GreetingPreset } from "./components/greetings/greetings";

// region :: Previous rendition of code: Rendered a simple hello world message.
    // const style = {
    //     backgroundColor: "orange",
    //     color: "white",
    //     fontFamily: "verdana"
    // }

    // ReactDOM.render(
    //     <h1 id="title" className="header" style={style}>Hello, world!</h1>,
    //     document.getElementById("react-container")
    // );
// endregion

const root = document.getElementById("react-container");

ReactDOM.render(
    <div>
        <Greeting greeting={GreetingPreset.hello} />
        <br/>
        <Greeting greeting={GreetingPreset.goodbye} />
        <br/>
        <Greeting greeting={GreetingPreset.hey} />
    </div>,
    root
);