import { IGrenadeLauncher } from "../../Interfaces/Guns/IGrenadeLauncher";
import { Player } from "../Player";

export class GrenadeLauncher implements IGrenadeLauncher{

    explosionRadius: number;
    gunFrame: number;
    ammo: number;
    damage: number;
    distance: number;
    price: number;

    private _maxAmmo: number;

    constructor(grenadeLauncher: {gunFrame: number, ammo: number, explosionRadius: number, damage: number, distance: number, price: number}) {
        this.gunFrame = grenadeLauncher.gunFrame;
        this.ammo = grenadeLauncher.ammo;
        this.explosionRadius = grenadeLauncher.explosionRadius;
        this.damage = grenadeLauncher.damage;
        this._maxAmmo = grenadeLauncher.ammo;
        this.distance = grenadeLauncher.distance;
        this.price = grenadeLauncher.price;
    }


    shoot(targetPlayer: Player) {
        throw new Error("Method not implemented.");
    }
    refillAmmo() {
        this.ammo = this._maxAmmo;
    }
    createGunImage() {
        throw new Error("Method not implemented.");
    }

}