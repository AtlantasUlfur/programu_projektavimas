import { Scene } from "phaser";
import { Player } from "../../Models/Player";

export interface IGun {
    gunFrame: number,
    ammo: number,
    damage: number,

    shoot(targetPlayer: Player);
    refillAmmo();
    createGunImage(scene: Scene);
}