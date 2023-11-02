import { IAbstractGunFactory } from '../AbstractFactories/IAbstractGunFactory'
import { IPistol } from '../../Interfaces/Guns/IPistol'
import { Pistol } from '../../Models/Guns/Pistol'
import { ShortRangeGunStrategy, MediumRangeGunStrategy, LongRangeGunStrategy } from '../Strategy/GunStrategy'
import { Bullet } from '../../Models/Bullet'

export class PistolFactory implements IAbstractGunFactory {
  CreateWeakGun(): IPistol {
    return new Pistol({
      gunFrame: 0,
      ammo: 5,
      damage: 10,
      distance: 3,
      price: 0,
      pushback: 0,
      damageStrategy: new ShortRangeGunStrategy(),
      bullet: new Bullet(1)
    })
  }
  CreateMiddleTierGun(): IPistol {
    return new Pistol({
      gunFrame: 2,
      ammo: 6,
      damage: 12,
      distance: 4,
      price: 100,
      pushback: 1,
      damageStrategy: new MediumRangeGunStrategy(),
      bullet: new Bullet(5)
    })
  }
  CreateHighTierGun(): IPistol {
    return new Pistol({
      gunFrame: 9,
      ammo: 7,
      damage: 15,
      distance: 4,
      price: 100,
      pushback: 1,
      damageStrategy: new LongRangeGunStrategy(),
      bullet: new Bullet(10)
    })
  }
}
