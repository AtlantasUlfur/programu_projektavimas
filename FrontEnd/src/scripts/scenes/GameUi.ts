import Phaser from 'phaser'

import { sceneEvents } from '../Events/EventsController'
import { Player } from '../Models/Player'

export default class GameUI extends Phaser.Scene
{
	//private hearts!: Phaser.GameObjects.Group
    MenuGroup
    baseSprite
    expandSprite
    backBtn
    nameLabel
    player
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
    init(player : Player){
        this.player = player
    }

	create()
	{
        const scene = this 
    
        this.baseSprite = this.add.sprite(0, 0, "base")
        this.baseSprite.displayHeight = 600
        this.baseSprite.displayWidth = 300
        this.baseSprite.setOrigin(1,0)
        this.baseSprite.setPosition(1000, 0)

        this.expandSprite = this.add.sprite(0, 0, "arrow")
        this.expandSprite.displayHeight = 40
        this.expandSprite.displayWidth = 40
        this.expandSprite.setOrigin(1,0)
        this.expandSprite.setPosition(1000, 300)
        this.expandSprite.setVisible(false)
        this.expandSprite.disableInteractive()
        this.expandSprite.on ('pointerdown', (event) => {
            this.MenuGroup.setVisible(true)
            this.expandSprite.disableInteractive()
            this.expandSprite.setVisible(false)
         });

        this.backBtn = this.add.sprite(0,0, "back")
        this.backBtn.displayHeight = 20
        this.backBtn.displayWidth = 20
        this.backBtn.setOrigin(1,0)
        this.backBtn.setPosition(990, 3)
        this.backBtn.setInteractive()
        this.backBtn.on ('pointerdown', (event) => {
            this.MenuGroup.setVisible(false)
            this.expandSprite.setInteractive()
            this.expandSprite.setVisible(true)
        
        });

        this.MenuGroup = this.add.group()
        this.MenuGroup.add(this.baseSprite)
        this.MenuGroup.add(this.expandSprite)
        this.MenuGroup.add(this.backBtn)

        this.nameLabel = this.add.text(0, 0, "xddd", {
			fontSize: '50'
		})
        this.nameLabel.scale = 2
        this.nameLabel.setOrigin(1,0)
        this.nameLabel.setPosition(870, 50)

        this.nameLabel.text = this.player.getPlayerName()
        
	}


}