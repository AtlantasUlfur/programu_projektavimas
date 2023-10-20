import { IPistol } from "../../ModelInterfaces/Guns/IPistol";
import { Player } from "../Player";

export class Pistol implements IPistol{
    gunFrame: number;
    ammo: number;
    damage: number;

    private _maxAmmo: number;

    constructor(gunFrame: number, ammo:number, damage:number){
        this.gunFrame = gunFrame;
        this.ammo = ammo;
        this._maxAmmo = ammo;
        this.damage = damage;
    }

    shoot(targetPlayer: Player) {
        throw new Error("Method not implemented.");
    }
    refillAmmo() {
        this.ammo = this._maxAmmo;
    }
    createGunImage(scene: Phaser.Scene) {
        throw new Error("Method not implemented.");
    }

}