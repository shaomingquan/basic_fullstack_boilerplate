import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import { observer } from "mobx-react";
import { observable } from "mobx";

const store = observable({
  count: 0
});

setInterval(() => {
  store.count++;
}, 100);

@observer
class App extends Component {
  render() {
    const { count } = store;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload. {count}
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
