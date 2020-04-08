import React, { Component } from "react";
import PhaserGame from "./PhaserGame";

class ReactGame extends Component {
  constructor() {
    super();
    this.state = {
      phaserSocket: undefined,
      greeting: undefined,
    };
  }

  componentDidMount() {
    this.game = new PhaserGame(this);
    console.log(this.state.phaserSocket);

    // const config: GameConfig = {
    //   type: Phaser.AUTO,
    //   width: GAME_WIDTH,
    //   height: GAME_HEIGHT,
    //   parent: "phaser-game",
    //   scene: [ExampleScene],
    // };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.phaserSocket !== this.state.phaserSocket) {
      this.props.changeMyState(this.state.greeting, this.state.phaserSocket);
    }
  }

  //   shouldComponentUpdate() {
  //     return false;
  //   }

  render() {
    console.log(this.state.greeting);
    return (
      <div id="react-game">
        <h1>{`${this.state.greeting} FROM REACTGAME.JSX CAN YOU SEE ME`}</h1>
      </div>
    );
  }
}

export default ReactGame;
