import { IAbstractGunFactory } from "../AbstractFactories/IAbstractGunFactory";
import { IPistol } from "../ModelInterfaces/Guns/IPistol";
import { Pistol } from "../Models/Guns/Pistol";

export class PistolFactory implements IAbstractGunFactory{
    CreateWeakGun(): IPistol {
        return new Pistol(
            0, 5, 10
        )
    }
    CreateMiddleTierGun(): IPistol {
        return new Pistol(
            2, 6, 12
        )
    }
    CreateHighTierGun(): IPistol {
        return new Pistol(
            9, 7, 15
        )
    }

}