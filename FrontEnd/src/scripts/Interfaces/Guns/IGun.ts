import { Scene } from "phaser";
import { Player } from "../../Models/Player";
import { GunDamageStrategy } from "../../utils/Strategy/GunStrategy";

export interface IGun {
    gunFrame: number,
    ammo: number,
    damage: number,
    distance: number,
    price: number,
    damageStrategy: GunDamageStrategy

    shoot(distance : number);
    refillAmmo();
    createGunImage(scene: Scene);
    setDamageStrategy(damageStrategy : GunDamageStrategy);
}