import * as Phaser from 'phaser';
import { config } from '../config/Config'
import { MainMenuScene } from './scenes/MainMenuScene';
import MainScene from './scenes/MainScene';

var MAIN_MENU_KEY = "MainMenu";
var MAIN_KEY = "MainScene";

class Game extends Phaser.Game {

    constructor()
    {
        super(config);

        this.scene.add(MAIN_MENU_KEY, MainMenuScene);
        this.scene.add(MAIN_KEY, MainScene);

        this.scene.start(MAIN_MENU_KEY);
    }

}

window.onload = function() {
    const game = new Game();
}
