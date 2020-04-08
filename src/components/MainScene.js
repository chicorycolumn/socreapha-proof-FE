import * as Phaser from "phaser";
import bomb from "../assets/bomb.png";
import shipblack from "../assets/shipblack.png";
import planeblack from "../assets/planeblack.png";
import socketIOClient from "socket.io-client";
const endpoint = "http://127.0.0.1:4001";
let sock;
let hasPhaserLoaded = false;
let numberOfPlayers = 0;
console.log("in mainscene");

export const favouriteAnimal = "dog";

export class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainScene" });
  }

  preload() {
    this.load.image("planeblack", planeblack);
    this.load.image("shipblack", shipblack);
    this.load.image("bomb", bomb);
    this.game.react.setState({ greeting: "helloooo" });

    MainScene.addOtherPlayers = (self, playerInfo) => {
      const otherPlayer = self.add
        .sprite(playerInfo.x, playerInfo.y, "shipblack")
        .setOrigin(0.5, 0.5)
        .setDisplaySize(53, 40);
      if (playerInfo.team === "blue") {
        otherPlayer.setTint(0x0000ff);
      } else {
        otherPlayer.setTint(0xff0000);
      }
      otherPlayer.playerId = playerInfo.playerId;
      self.otherPlayers.add(otherPlayer);
    };

    MainScene.addPlayer = (self, playerInfo) => {
      self.ship = self.physics.add
        .image(playerInfo.x, playerInfo.y, "planeblack")
        .setOrigin(0.5, 0.5) //Set rotation point to centre of ship.
        .setDisplaySize(53, 40);
      if (playerInfo.team === "blue") {
        self.ship.setTint(0x0000ff);
      } else {
        self.ship.setTint(0xff0000);
      }
      self.ship.setDrag(100);
      self.ship.setAngularDrag(100);
      self.ship.setMaxVelocity(200);
    };
  }

  //Create is for any changes I receive, during a game even.
  create() {
    var self = this;
    // this.socket = io();
    this.numPlayerText = this.add.text(16, 64, "", {
      fontSize: "32px",
      fill: "#FFFFFF",
    });

    sock = socketIOClient(endpoint);
    this.socket = sock;
    //Make a new socket, which is an instantiation of the io object we created in server.js.
    //Remember, the io object is the socket object listening to our server object.
    hasPhaserLoaded = true;
    console.log(222222222222);
    this.game.react.setState({ phaserSocket: sock });
    console.log(222222222222);

    //

    this.otherPlayers = this.physics.add.group();
    this.socket.on("currentPlayers", function (players) {
      Object.keys(players).forEach(function (id) {
        if (players[id].playerId === self.socket.id) {
          MainScene.addPlayer(self, players[id]); //********************** */
        } else {
          MainScene.addOtherPlayers(self, players[id]); //********************** */
        }
      });

      numberOfPlayers = Object.keys(players).length;
      self.numPlayerText.setText("Players " + numberOfPlayers);
    });
    this.socket.on("newPlayer", function (playerInfo) {
      MainScene.addOtherPlayers(self, playerInfo); //********************** */
      numberOfPlayers++;
      self.numPlayerText.setText("Players " + numberOfPlayers);
    });
    this.socket.on("disconnect", function (playerId) {
      self.otherPlayers.getChildren().forEach(function (otherPlayer) {
        if (playerId === otherPlayer.playerId) {
          otherPlayer.destroy();
          numberOfPlayers--;
          self.numPlayerText.setText("Players " + numberOfPlayers);
        }
      });
    });

    this.cursors = this.input.keyboard.createCursorKeys();
    //Populate the cursors object with our four main Key objects (up, down, left, and right),
    //which will bind to those arrows on the keyboard.

    this.socket.on("playerMoved", function (playerInfo) {
      self.otherPlayers.getChildren().forEach(function (otherPlayer) {
        if (playerInfo.playerId === otherPlayer.playerId) {
          otherPlayer.setRotation(playerInfo.rotation);
          otherPlayer.setPosition(playerInfo.x, playerInfo.y);
        }
      });
    });

    this.blueScoreText = this.add.text(16, 16, "", {
      fontSize: "32px",
      fill: "#0000FF",
    });
    this.redScoreText = this.add.text(584, 16, "", {
      fontSize: "32px",
      fill: "#FF0000",
    });

    this.socket.on("scoreUpdate", function (scores) {
      self.blueScoreText.setText("Blue: " + scores.blue);
      self.redScoreText.setText("Red: " + scores.red);
    });

    this.socket.on("starLocation", function (starLocation) {
      if (self.star) self.star.destroy();
      self.star = self.physics.add.image(
        starLocation.x,
        starLocation.y,
        "bomb"
      );
      self.physics.add.overlap(
        self.ship,
        self.star,
        function () {
          this.socket.emit("starCollected");
        },
        null,
        self
      );
    });
  }

  //Update is about me the client socket making changes.
  update() {
    if (this.ship) {
      if (this.cursors.left.isDown) {
        this.ship.setAngularVelocity(-150);
      } else if (this.cursors.right.isDown) {
        this.ship.setAngularVelocity(150);
      } else {
        this.ship.setAngularVelocity(0);
      }
      if (this.cursors.up.isDown) {
        this.physics.velocityFromRotation(
          this.ship.rotation + 1.5,
          100,
          this.ship.body.acceleration
        );
      } else {
        this.ship.setAcceleration(0);
      }
      // this.physics.world.wrap(this.ship, 5);
      //Event horizon wrapping around.

      // emit player movement
      var x = this.ship.x;
      var y = this.ship.y;
      var r = this.ship.rotation;
      if (
        this.ship.oldPosition &&
        (x !== this.ship.oldPosition.x ||
          y !== this.ship.oldPosition.y ||
          r !== this.ship.oldPosition.rotation)
      ) {
        this.socket.emit("playerMovement", {
          x: this.ship.x,
          y: this.ship.y,
          rotation: this.ship.rotation,
        });
      }

      // save old position data
      this.ship.oldPosition = {
        x: this.ship.x,
        y: this.ship.y,
        rotation: this.ship.rotation,
      };
    }
  }

  // ReactDOM.render(<App sock={sock} />, document.getElementById("root"));
  // setInterval(() => {
  //   if (hasPhaserLoaded) {
  //     ReactDOM.render(<App sock={sock} />, document.getElementById("root"));
  //   }
  // }, 1000);

  // ReactDOM.render(<App sock={sock} />, document.getElementById("root")); // Renders Rea and Pha, but double players.
  // ReactDOM.render(document.getElementById("root")); // Renders Pha only.
  // ReactDOM.render(<App />); // Renders Pha only.
}
