import * as Phaser from 'phaser';

export default class Demo extends Phaser.Scene
{
    constructor ()
    {
        super('demo');
    }

    preload ()
    {

    }

    create ()
    {



    }
}

const config = {
    type: Phaser.AUTO,
    backgroundColor: '#00000',
    width: 1280,
    height: 600,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: Demo
};

const game = new Phaser.Game(config);
