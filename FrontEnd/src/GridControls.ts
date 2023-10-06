import { Direction } from "./Direction";
import { GridPhysics } from "./GridPhysics";

export class GridControls {
  constructor(
    private input: Phaser.Input.InputPlugin,
    private gridPhysics: GridPhysics
  ) {}

  update(_time) : boolean {
    const cursors = this.input.keyboard.createCursorKeys();
    if (cursors.left.isDown) {
      this.gridPhysics.movePlayer(Direction.LEFT, _time);
      return true;
    } else if (cursors.right.isDown) {
      this.gridPhysics.movePlayer(Direction.RIGHT, _time);
      return true;
    } else if (cursors.up.isDown) {
      this.gridPhysics.movePlayer(Direction.UP, _time);
      return true;
    } else if (cursors.down.isDown) {
      this.gridPhysics.movePlayer(Direction.DOWN, _time);
      return true;
    }
    return false;
  }
}