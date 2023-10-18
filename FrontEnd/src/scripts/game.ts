import * as Phaser from 'phaser';
import { config } from '../config/Config'
import { MainMenuScene } from './scenes/MainMenuScene';

var MAIN_MENU_KEY = "MainMenu";

class Game extends Phaser.Game {

    constructor()
    {
        super(config);

        this.scene.add(MAIN_MENU_KEY, MainMenuScene);

        this.scene.start(MAIN_MENU_KEY);
    }

}

window.onload = function() {
    const game = new Game();
}
