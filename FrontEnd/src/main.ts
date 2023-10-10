import * as Phaser from "phaser";
import { GameScene } from "./Scenes/GameScene";
import {StartMenuScene} from "./Scenes/StartMenuScene"
import _ from "lodash";

export const CANVAS_WIDTH = 720;
export const CANVAS_HEIGHT = 528;

const gameConfig: Phaser.Types.Core.GameConfig = {
  title: "Sample",
  render: {
    antialias: false,
  },
  type: Phaser.AUTO,
  scene: [
    StartMenuScene, GameScene
  ],
  scale: {
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  parent: "game",
  backgroundColor: "#48C4F8",
};

export const game = new Phaser.Game(gameConfig);
