import { IRifle } from "../../ModelInterfaces/Guns/IRifle";
import { Player } from "../Player";

export class Rifle implements IRifle{
    gunFrame: number;
    ammo: number;
    damage: number;
    fireRate: number;

    private _maxAmmo: number;

    constructor(gunFrame: number, ammo: number, damage: number, fireRate: number){
        this.gunFrame = gunFrame;
        this.ammo = ammo;
        this._maxAmmo = ammo;
        this.damage = damage;
        this.fireRate = fireRate;
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