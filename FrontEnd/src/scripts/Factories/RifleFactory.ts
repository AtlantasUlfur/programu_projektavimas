import { IAbstractGunFactory } from "../AbstractFactories/IAbstractGunFactory";
import { IRifle } from "../ModelInterfaces/Guns/IRifle";
import { Rifle } from "../Models/Guns/Rifle";

export class RifleFactory implements IAbstractGunFactory{
    CreateWeakGun(): IRifle {
        return new Rifle(
            3, 10, 10, 2
        )
    }
    CreateMiddleTierGun(): IRifle {
        return new Rifle(
            1, 15, 15, 2
        )
    }
    CreateHighTierGun(): IRifle {
        return new Rifle(
            15, 15, 15, 3
        )
    }

}