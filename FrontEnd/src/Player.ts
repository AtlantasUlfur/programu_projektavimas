import { Direction } from "./Direction";
import { GameScene } from "./main";

export class Player {
  constructor(
    private sprite: Phaser.GameObjects.Sprite,
    private tilePos: Phaser.Math.Vector2,
    private scene: GameScene
  ) {
    const offsetX = GameScene.TILE_SIZE / 2;
    const offsetY = GameScene.TILE_SIZE;
    this.sprite.setInteractive();
    sprite.on('pointerdown', function (pointer)
    {

        this.setTint(0xff0000);
        let element = document.getElementById('input-box')
        if(element && element.style.display === 'none') {
               
         element.style.display = 'block';
       
         for (let i = 0; i < element.children.length; i++) {

             if(element.children[i].tagName === 'INPUT'){  
          
               element.children[i].addEventListener('input',()=>{
                         
               })
             }
   
             else {
               element.children[i].addEventListener('click',()=>{
                 element.style.display = 'none'
               })
             }
         }
       }        
     

    });
    sprite.on('pointerout', function (pointer)
    {

        this.clearTint();

    });
    sprite.on('pointerup', function (pointer)
        {

            this.clearTint();

        });
    this.sprite.setOrigin(0.5, 1);
    this.sprite.setPosition(
      tilePos.x * GameScene.TILE_SIZE + offsetX,
      tilePos.y * GameScene.TILE_SIZE + offsetY
    );
    this.sprite.setFrame(55);
  }
  
  getPosition(): Phaser.Math.Vector2 {
    return this.sprite.getBottomCenter();
  }

  setPosition(position: Phaser.Math.Vector2): void {
    this.sprite.setPosition(position.x, position.y);
  }

  getTilePos(): Phaser.Math.Vector2 {
    return this.tilePos.clone();
  }

  setTilePos(tilePosition: Phaser.Math.Vector2): void {
    this.tilePos = tilePosition.clone();
    this.setPosition( new Phaser.Math.Vector2(
      tilePosition.x * GameScene.TILE_SIZE + GameScene.TILE_SIZE / 2,
      tilePosition.y * GameScene.TILE_SIZE + GameScene.TILE_SIZE))
  }

  stopAnimation(direction: Direction) {
    //const animationManager = this.sprite.anims.animationManager;
    //const standingFrame = animationManager.get(direction).frames[1].frame.name;
    //this.sprite.anims.stop();
    //this.sprite.setFrame(standingFrame);
  }

  startAnimation(direction: Direction) {
    //this.sprite.anims.play(direction);
  }
}