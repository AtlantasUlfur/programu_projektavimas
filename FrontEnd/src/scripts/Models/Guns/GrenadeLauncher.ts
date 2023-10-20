import { IGrenadeLauncher } from "../../ModelInterfaces/Guns/IGrenadeLauncher";
import { Player } from "../Player";

export class GrenadeLauncher implements IGrenadeLauncher{

    explosionRadius: number;
    gunFrame: number;
    ammo: number;
    damage: number;
    
    private _maxAmmo: number;

    constructor(gunFrame: number, ammo: number, explosionRadius: number, damage: number) {
        this.gunFrame = gunFrame;
        this.ammo = ammo;
        this.explosionRadius = explosionRadius;
        this.damage = damage;
        this._maxAmmo = ammo;
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