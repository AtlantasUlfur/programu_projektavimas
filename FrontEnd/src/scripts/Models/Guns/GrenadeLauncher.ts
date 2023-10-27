import { IGrenadeLauncher } from '../../Interfaces/Guns/IGrenadeLauncher'
import { IGunDamageStrategy } from '../../utils/Strategy/GunStrategy'
import { Player } from '../Player'

export class GrenadeLauncher implements IGrenadeLauncher {
  explosionRadius: number
  gunFrame: number
  ammo: number
  damage: number
  distance: number
  price: number
  damageStrategy: IGunDamageStrategy
  private _maxAmmo: number

  constructor(grenadeLauncher: {
    gunFrame: number
    ammo: number
    explosionRadius: number
    damage: number
    distance: number
    price: number
    damageStrategy: IGunDamageStrategy
  }) {
    this.gunFrame = grenadeLauncher.gunFrame
    this.ammo = grenadeLauncher.ammo
    this.explosionRadius = grenadeLauncher.explosionRadius
    this.damage = grenadeLauncher.damage
    this._maxAmmo = grenadeLauncher.ammo
    this.distance = grenadeLauncher.distance
    this.price = grenadeLauncher.price
    this.damageStrategy = grenadeLauncher.damageStrategy
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
  createGunImage() {
    throw new Error('Method not implemented.')
  }
}
