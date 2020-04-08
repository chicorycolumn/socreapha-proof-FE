import React from "react";
import socketIOClient from "socket.io-client";
const endpoint = "http://127.0.0.1:4001";
const socket = socketIOClient(endpoint);
socket.favouritecolor = "crimson";
// import { socket } from "../index";

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      response: false,
      endpoint: "http://127.0.0.1:4001",
    };
  }

  componentDidMount() {
    // console.log(this.props);
    // const { endpoint } = this.state;
    // const socket = socketIOClient(endpoint);

    // this.props.sock.on("time", (data) => {
    //   this.setState({ response: data });
    // });

    console.log("REACT SOCKET");
    console.log(socket);
    console.log("REACT SOCKET");

    socket.on("time", (data) => {
      this.setState({ response: data });
    });
  }

  render() {
    console.log("in app.jsx");
    const { response } = this.state;
    return (
      <div style={{ textAlign: "center" }}>
        {response ? <p>The time is: {response}</p> : <p>Loading...</p>}
      </div>
    );
  }
}
