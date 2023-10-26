import * as Phaser from 'phaser'

export class Button {
  public Image: Phaser.GameObjects.Image
  public Text: Phaser.GameObjects.Text

  constructor(image: Phaser.GameObjects.Image, text: Phaser.GameObjects.Text) {
    this.Image = image
    this.Text = text
  }
}
