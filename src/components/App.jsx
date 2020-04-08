import React, { Component, Fragment } from "react";
import PhaserGame from "./PhaserGame";
import ReactGame from "./ReactGame.jsx";
import socketIOClient from "socket.io-client";
const endpoint = "http://127.0.0.1:4001";
// const socket = socketIOClient(endpoint);
// socket.favouritecolor = "crimson";
import { favouriteAnimal } from "./MainScene";

console.log(favouriteAnimal);
// import { socket } from "../index";

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      response: false,
      endpoint: "http://127.0.0.1:4001",
      greeting: "nothing",
      phaserSocket: null,
    };
    this.changeMyState = this.changeMyState.bind(this);
  }

  componentDidMount() {
    console.log("mmmmmmount");
    console.log(this.state.phaserSocket);
    console.log("mmmmmmount");
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.phaserSocket !== this.state.phaserSocket) {
      console.log("WOOOOOOOOOOOOOOOOOOO");

      console.log(this.state.phaserSocket);

      this.state.phaserSocket.on("time", (data) => {
        this.setState({ response: data });
      });
    }
  }

  changeMyState(greeting, phaserSocket) {
    this.setState({ greeting, phaserSocket });
  }

  render() {
    console.log("in app.jsx");
    console.log(this.state.phaserSocket);
    const { response } = this.state;
    return (
      <div style={{ textAlign: "center", border: "blue solid 5pt" }}>
        {response ? <p>The time is: {response}</p> : <p>Loading...</p>}
        <p>{`${this.state.greeting} and welcome to App.jsx`}</p>
        <div
          id="gameContainer"
          style={{ textAlign: "center", border: "fuchsia solid 5pt" }}
        >
          {/* <ReactGame socket={socket} /> */}
          <ReactGame changeMyState={this.changeMyState} />
        </div>
      </div>
    );
  }
}
