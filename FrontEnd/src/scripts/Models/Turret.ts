import { IGunOwnerAbstraction } from "../Interfaces/BridgeAbstraction/IGunOwnerAbstraction";
import { IGun } from "../Interfaces/Guns/IGun";
import { SizeEnum } from "./Enums";

export class Turret extends Phaser.GameObjects.Sprite implements IGunOwnerAbstraction{

    public tilePos: Phaser.Math.Vector2;
    public gunImage: Phaser.GameObjects.Image;
    public selectedGun: IGun;


    constructor(scene: Phaser.Scene, key: string, scale: number) {
        super(scene, 0, 0, key);
        this.setScale(scale)
    }

    setPos(tilePos: Phaser.Math.Vector2): void{
        this.tilePos = tilePos;
        this.setPosition(
            this.tilePos.x * SizeEnum.TILE_SIZE + SizeEnum.TILE_X_OFFSET,
            this.tilePos.y * SizeEnum.TILE_SIZE - SizeEnum.TILE_Y_OFFSET + SizeEnum.TILE_SIZE
        )
    }
}