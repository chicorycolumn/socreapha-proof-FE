import Phaser from "phaser";
import { MainScene } from "./MainScene";

class PhaserGame extends Phaser.Game {
  constructor(react) {
    const config = {
      type: Phaser.AUTO, //Use WebGL if avail, otherwise Canvas.
      parent: "phaser-example", //Could this adding a canvas element conflict with the photo taking canvas?
      width: 800,
      height: 600,
      physics: {
        default: "arcade", //Physics
        arcade: {
          debug: false,
          gravity: { y: 0 },
        },
      },
      scene: [MainScene],
    };
    super(config);
    this.react = react;
  }
}

export default PhaserGame;
