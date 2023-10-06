import { Direction } from "./Direction";
import { GameScene } from "./main";

export class Player {
  constructor(
    private sprite: Phaser.GameObjects.Sprite,
    private tilePos: Phaser.Math.Vector2
  ) {
    const offsetX = GameScene.TILE_SIZE / 2;
    const offsetY = GameScene.TILE_SIZE;

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