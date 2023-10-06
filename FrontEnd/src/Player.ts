import { Direction } from "./Direction";
import { GameScene } from "./main";

export class Player {
  private playerName: Phaser.GameObjects.Text;

  constructor(
    private sprite: Phaser.GameObjects.Sprite,
    private tilePos: Phaser.Math.Vector2,
    private scene: GameScene
  ) {
    const offsetX = GameScene.TILE_SIZE / 2;
    const offsetY = GameScene.TILE_SIZE;
    this.sprite.setInteractive();
    const self = this;
    sprite.on("pointerdown", function (pointer) {
      if (self.playerName.text != "YOU") {
        this.setTint(0xff0000);
        let element = document.getElementById("input-box2");
        if (element && element.style.display === "none") {
          element.style.display = "block";

          for (let i = 0; i < element.children.length; i++) {
            if (element.children[i].tagName === "INPUT") {
              element.children[i].addEventListener("input", () => {});
            } else {
              let element_next = document.getElementById("input-box");
              element_next.style.display = "none";
              element.children[i].addEventListener("click", () => {
                element.style.display = "none";
              });
            }
          }
        }
      } else {
        let element = document.getElementById("input-box");
        if (element && element.style.display === "none") {
          element.style.display = "block";

          for (let i = 0; i < element.children.length; i++) {
            if (element.children[i].tagName === "INPUT") {
              element.children[i].addEventListener("input", () => {});
            } else {
              let element_next = document.getElementById("input-box2");
              element_next.style.display = "none";
              element.children[i].addEventListener("click", () => {
                element.style.display = "none";
              });
            }
          }
        }
      }
    });
    sprite.on("pointerup", function (pointer) {
      this.clearTint();
    });
    this.sprite.setOrigin(0.5, 1);
    this.sprite.setPosition(
      tilePos.x * GameScene.TILE_SIZE + offsetX,
      tilePos.y * GameScene.TILE_SIZE + offsetY
    );
    this.sprite.setFrame(55);

    this.playerName = this.sprite.scene.add.text(0, 0, "ENEMY", {
      fontFamily: "Arial",
      fontSize: 16,
      fontStyle: "bold",
      color: "#FF0000",
    });
    this.playerName.setDepth(10);
    this.playerName.setOrigin(0.5, 1);
    this.playerName.setPosition(
      tilePos.x * GameScene.TILE_SIZE + offsetX,
      tilePos.y * GameScene.TILE_SIZE - offsetY
    );
  }

  setPlayerName(name: string) {
    this.playerName.setText(name);
    this.playerName.setStyle({
      fontFamily: "Arial",
      fontSize: 16,
      fontStyle: "bold",
      color: "#008000",
    });
  }

  getPosition(): Phaser.Math.Vector2 {
    return this.sprite.getBottomCenter();
  }

  setPosition(position: Phaser.Math.Vector2): void {
    this.sprite.setPosition(position.x, position.y);
    this.playerName.setPosition(position.x, position.y - 96);
  }

  getTilePos(): Phaser.Math.Vector2 {
    return this.tilePos.clone();
  }

  setPlayerVisible(isVisible: boolean) {
    this.sprite.setVisible(isVisible);
    this.playerName.setVisible(isVisible);
  }

  setTilePos(tilePosition: Phaser.Math.Vector2): void {
    this.tilePos = tilePosition.clone();
    this.setPosition(
      new Phaser.Math.Vector2(
        tilePosition.x * GameScene.TILE_SIZE + GameScene.TILE_SIZE / 2,
        tilePosition.y * GameScene.TILE_SIZE + GameScene.TILE_SIZE
      )
    );
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
