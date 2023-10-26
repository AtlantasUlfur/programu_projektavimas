import { IAbstractGunFactory } from './AbstractFactories/IAbstractGunFactory'
import { GrenadeLauncherFactory } from './Factories/GrenadeLauncherFactory'
import { PistolFactory } from './Factories/PistolFactory'
import { RifleFactory } from './Factories/RifleFactory'
import { IGun } from '../Interfaces/Guns/IGun'

export class GunCreator {
  static CreateAllGuns(): Array<IGun> {
    const guns: Array<IGun> = []
    const gunFactories: Array<IAbstractGunFactory> = [
      new PistolFactory() as IAbstractGunFactory,
      new RifleFactory() as IAbstractGunFactory,
      new GrenadeLauncherFactory() as IAbstractGunFactory
    ]

    for (const factory of gunFactories) {
      guns.push(factory.CreateWeakGun(), factory.CreateMiddleTierGun(), factory.CreateHighTierGun())
    }

    return guns
  }
}
