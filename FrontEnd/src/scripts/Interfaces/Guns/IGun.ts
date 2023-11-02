import { Scene } from 'phaser'
import { Player } from '../../Models/Player'
import { IGunDamageStrategy } from '../../utils/Strategy/GunStrategy'
import { IGunPrototype } from '../../utils/Prototype/IGunPrototype'
import { Bullet } from '../../Models/Bullet'

export interface IGun extends IGunPrototype {
  gunFrame: number
  ammo: number
  damage: number
  distance: number
  price: number
  damageStrategy: IGunDamageStrategy
  bullet : Bullet

  shoot(distance: number)
  refillAmmo()
  createGunImage(scene: Scene)
  setDamageStrategy(damageStrategy: IGunDamageStrategy)
}
