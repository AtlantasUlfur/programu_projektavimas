import * as Phaser from "phaser";

export const config = {
    type: Phaser.AUTO,
    backgroundColor: '#00000',
    width: 800,
    height: 600,
    
    render: {
        pixelArt: true,
      },
    scale: {
        parent: "mygame",
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: []
};