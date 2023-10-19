import Phaser from 'phaser'

import { sceneEvents } from '../Events/EventsController'

export default class GameUI extends Phaser.Scene
{
	//private hearts!: Phaser.GameObjects.Group

	constructor()
	{
		super({ key: 'UIScene' })
	}
    preload(){
        //Load textures
        this.load.spritesheet("base", "../../assets/base.png", {frameWidth: 1920, frameHeight: 1080});
        this.load.spritesheet("back", "../../assets/back.png", {frameWidth: 64, frameHeight: 64});
        this.load.spritesheet("arrow", "../../assets/arrow.png", {frameWidth: 64, frameHeight: 64});
        
    }

	create()
	{
		console.log('X')
        const scene = this;
		const coinsLabel = this.add.text(12, 20, '0', {
			fontSize: '14'
		})
        const baseSprite = this.add.sprite(0, 0, "base")
        baseSprite.displayHeight = 600
        baseSprite.displayWidth = 300
        baseSprite.setOrigin(1,0)
        baseSprite.setPosition(1000, 0)

        const expandSprite = this.add.sprite(0, 0, "arrow")
        expandSprite.displayHeight = 40
        expandSprite.displayWidth = 40
        expandSprite.setOrigin(1,0)
        expandSprite.setPosition(1000, 300)
        expandSprite.setVisible(false)
        expandSprite.disableInteractive()
        expandSprite.on ('pointerdown', (event) => {

            baseSprite.setVisible(true)
            expandSprite.disableInteractive()
            expandSprite.setVisible(false)
            baseSprite.setInteractive() 
            backBtn.setInteractive() //TODO: GROUP
            backBtn.setVisible(true)
         
         });

        const backBtn = this.add.sprite(0,0, "back")
        backBtn.displayHeight = 20
        backBtn.displayWidth = 20
        backBtn.setOrigin(1,0)
        backBtn.setPosition(990, 3)
        backBtn.setInteractive()
        backBtn.on ('pointerdown', (event) => {

           baseSprite.setVisible(false)
           backBtn.disableInteractive()
           backBtn.setVisible(false)
           expandSprite.setInteractive()
           expandSprite.setVisible(true)
        
        });


		sceneEvents.on('start', (coins: number) => {
			coinsLabel.text = coins.toLocaleString()
		})
	}

	private handlePlayerHealthChanged(health: number)
	{

	}
}