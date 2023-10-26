import { IGun } from '../../Interfaces/Guns/IGun'

export interface IAbstractGunFactory {
  CreateWeakGun(): IGun
  CreateMiddleTierGun(): IGun
  CreateHighTierGun(): IGun
}
