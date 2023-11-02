import { IRifle } from '../../Interfaces/Guns/IRifle'
import { Player } from '../Player'
import { IGunDamageStrategy } from '../../utils/Strategy/GunStrategy'
import { Bullet } from '../Bullet'

export class Rifle implements IRifle {
  gunFrame: number
  ammo: number
  damage: number
  fireRate: number
  distance: number
  price: number
  damageStrategy: IGunDamageStrategy
  bullet : Bullet

  private _maxAmmo: number

  constructor(rifle: {
    gunFrame: number
    ammo: number
    damage: number
    fireRate: number
    distance: number
    price: number
    damageStrategy: IGunDamageStrategy
  }) {
    this.gunFrame = rifle.gunFrame
    this.ammo = rifle.ammo
    this._maxAmmo = rifle.ammo
    this.damage = rifle.damage
    this.fireRate = rifle.fireRate
    this.distance = rifle.distance
    this.price = rifle.price
    this.damageStrategy = rifle.damageStrategy
  }
  setDamageStrategy(damageStrategy: IGunDamageStrategy) {
    this.damageStrategy = damageStrategy
  }

    shoot(distance: number) {
        return this.damageStrategy.calculateDamage(distance, this.damage);
    }
    refillAmmo() {
        this.ammo = this._maxAmmo;
    }
    createGunImage(scene: Phaser.Scene) {
        throw new Error("Method not implemented.");
    }
    deepCopy(){
      const clonedGun = new Rifle({
        gunFrame: this.gunFrame,
        ammo: this.ammo,
        damage: this.damage,
        distance: this.distance,
        fireRate: this.fireRate,
        price: this.price,
        damageStrategy: this.damageStrategy
      });
      return clonedGun;
    }
    shallowCopy(){
      return Object.assign({}, this);
  }
}
