import { IGun } from "../ModelInterfaces/Guns/IGun";

export interface IAbstractGunFactory{
    CreateWeakGun(): IGun;
    CreateMiddleTierGun(): IGun;
    CreateHighTierGun(): IGun;
}