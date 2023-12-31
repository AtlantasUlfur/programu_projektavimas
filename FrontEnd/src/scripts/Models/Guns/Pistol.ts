import { IPistol } from '../../Interfaces/Guns/IPistol'
import { Player } from '../Player'
import { IGunDamageStrategy } from '../../utils/Strategy/GunStrategy'
import { Bullet } from '../Bullet'

export class Pistol implements IPistol {
  gunFrame: number
  ammo: number
  damage: number
  pushback?: number | undefined
  distance: number
  price: number
  damageStrategy: IGunDamageStrategy
  private _maxAmmo: number
  bullet : Bullet;

  constructor(pistol: {
    gunFrame: number
    ammo: number
    damage: number
    distance: number
    price: number
    pushback: number | undefined
    damageStrategy: IGunDamageStrategy
    bullet: Bullet
  }) {
    this.gunFrame = pistol.gunFrame
    this.ammo = pistol.ammo
    this._maxAmmo = pistol.ammo
    this.damage = pistol.damage
    this.distance = pistol.distance
    this.price = pistol.price
    this.pushback = pistol.pushback
    this.damageStrategy = pistol.damageStrategy
    this.bullet = pistol.bullet;
  }
  setDamageStrategy(damageStrategy: IGunDamageStrategy) {
    this.damageStrategy = damageStrategy
  }

  shoot(distance: number) {
    return this.damageStrategy.calculateDamage(distance, this.damage)
  }
  refillAmmo() {
    this.ammo = this._maxAmmo
  }
  createGunImage(scene: Phaser.Scene) {
    throw new Error('Method not implemented.')
  }
  deepCopy(){
    const clonedGun = new Pistol({
      gunFrame: this.gunFrame,
      ammo: this.ammo,
      damage: this.damage,
      distance: this.distance,
      pushback: this.pushback,
      price: this.price,
      damageStrategy: this.damageStrategy,
      bullet: new Bullet(this.bullet.dmg)
    });
    return clonedGun;
  }
  shallowCopy(){
    return Object.assign({}, this);
}
}
