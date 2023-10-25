import { IRifle } from "../../Interfaces/Guns/IRifle";
import { Player } from "../Player";

export class Rifle implements IRifle{
    gunFrame: number;
    ammo: number;
    damage: number;
    fireRate: number;
    distance: number;
    price: number;

    private _maxAmmo: number;

    constructor(rifle: {gunFrame: number, ammo: number, damage: number, fireRate: number, distance: number, price: number}){
        this.gunFrame = rifle.gunFrame;
        this.ammo = rifle.ammo;
        this._maxAmmo = rifle.ammo;
        this.damage = rifle.damage;
        this.fireRate = rifle.fireRate;
        this.distance = rifle.distance;
        this.price = rifle.price;
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