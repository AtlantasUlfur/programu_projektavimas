import { IPistol } from "../../Interfaces/Guns/IPistol";
import { Player } from "../Player";

export class Pistol implements IPistol{
    gunFrame: number;
    ammo: number;
    damage: number;
    pushback?: number | undefined;
    distance: number;
    price: number;

    private _maxAmmo: number;

    constructor(pistol: {gunFrame: number, ammo:number, damage:number, distance: number, price: number, pushback: number | undefined}){
        this.gunFrame = pistol.gunFrame;
        this.ammo = pistol.ammo;
        this._maxAmmo = pistol.ammo;
        this.damage = pistol.damage;
        this.distance = pistol.distance;
        this.price = pistol.price;
        this.pushback = pistol.pushback;
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