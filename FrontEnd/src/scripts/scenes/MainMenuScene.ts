import * as Phaser from "phaser";
import SocketController from "../SocketController";
import { Button } from "../Models/Button";

export class MainMenuScene extends Phaser.Scene {
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private buttons: Button[] = [];
	private selectedButtonIndex = 0;
    private buttonSelector!: Phaser.GameObjects.Image;
    private socketInstance : SocketController;

    constructor()
    {
        super("MainMenu")   
    }

    init()
	{
		this.cursors = this.input.keyboard.createCursorKeys()

        // //Socket initialise
        this.socketInstance = SocketController.getInstance();
        this.socketInstance.connect("http://localhost:8081")
	}

	preload()
    {
		this.load.image('glass-panel', '../../assets/glassPanel.png')
		this.load.image('cursor-hand', '../../assets/cursor_hand.png')
    }

    create()
    {
        const scene = this;

        

        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            createButtonImage.off('selected')
        })

        const { width, height } = this.scale

        //Title
        var title = this.add.text(width * 0.5, height * 0.2, 'XCOM GAME')
            .setOrigin(0.5).setFontSize(58);

        // Play button
        var createButtonImage = this.add.image(width * 0.5, height * 0.6, 'glass-panel')
            .setDisplaySize(150, 50)
        var createButtonText = this.add.text(createButtonImage.x, createButtonImage.y, 'Create Game')
            .setOrigin(0.5)

        var createButton = new Button(createButtonImage, createButtonText);
    
        // Join Button
        var joinButtonImage = this.add.image(createButtonImage.x, createButtonImage.y + createButtonImage.displayHeight + 10, 'glass-panel')
            .setDisplaySize(150, 50)
        var joinButtonText = this.add.text(joinButtonImage.x, joinButtonImage.y, 'Join Game')
            .setOrigin(0.5)
        
        var joinButton = new Button(joinButtonImage, joinButtonText);

        this.buttons.push(createButton);
        this.buttons.push(joinButton)
        this.buttonSelector = this.add.image(0, 0, 'cursor-hand')
        this.selectButton(0)

        createButtonImage.on('selected', () => {
            console.log("Create game pressed");
            this.buttonClick(scene, 0);
        })
    
        joinButtonImage.on('selected', () => {
            console.log("Join game pressed");
            this.buttonClick(scene, 1);
        })
    
	}

	selectButton(index: number)
	{
		const currentButton = this.buttons[this.selectedButtonIndex]

        // set the current selected button to a white tint
        currentButton.Image.setTint(0xffffff)

        const button = this.buttons[index]

        // set the newly selected button to a green tint
        button.Image.setTint(0x66ff7f)

        // move the hand cursor to the right edge
        this.buttonSelector.x = button.Image.x + button.Image.displayWidth * 0.5
        this.buttonSelector.y = button.Image.y + 10

        // store the new selected index
        this.selectedButtonIndex = index
	}

	selectNextButton(change = 1)
	{
		let index = this.selectedButtonIndex + change

        // wrap the index to the front or end of array
        if (index >= this.buttons.length)
        {
            index = 0
        }
        else if (index < 0)
        {
            index = this.buttons.length - 1
        }

        this.selectButton(index)
	}

	confirmSelection()
	{
		const button = this.buttons[this.selectedButtonIndex]

        // emit the 'selected' event
        button.Image.emit('selected')
	}
	
	update()
	{
		const upJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up!)
		const downJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.down!)
		const spaceJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.space!)
		if (upJustPressed)
		{
			this.selectNextButton(-1)
		}
		else if (downJustPressed)
		{
			this.selectNextButton(1)
		}
		else if (spaceJustPressed)
		{
            this.confirmSelection()
		}
	}

    buttonClick(scene : this, index : number){

        var lobbyName = prompt("Please enter lobby name:", "Lebron's Room");

        //Hide Buttons
        scene.buttons.forEach( element => {
            element.Image.visible = false;
            element.Text.visible = false;
        });
        scene.buttonSelector.visible = false;

        //Index = 0 -> Create Game; index = 1 -> Join Game
        if(0 == index){ 
            scene.add.text(scene.scale.width * 0.5, scene.scale.height * 0.5, 'You are host')
            .setOrigin(0.5)
            scene.add.text(scene.scale.width * 0.5, scene.scale.height * 0.6, 'Waiting for players... 1/4')
            .setOrigin(0.5)

            scene.socketInstance.createLobby(lobbyName);
        }
        else{
            scene.add.text(scene.scale.width * 0.5, scene.scale.height * 0.6, 'Waiting for players... 2/4')
            .setOrigin(0.5)

        }
    }
}