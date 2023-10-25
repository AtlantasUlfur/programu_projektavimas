import { IAbstractGunFactory } from "../AbstractFactories/IAbstractGunFactory";
import { IRifle } from "../../Interfaces/Guns/IRifle";
import { Rifle } from "../../Models/Guns/Rifle";

export class RifleFactory implements IAbstractGunFactory{
    CreateWeakGun(): IRifle {
        return new Rifle({
            gunFrame: 3,
            ammo: 10,
            damage: 10,
            fireRate: 2,
            distance: 4,
            price: 150
        });
    }
    CreateMiddleTierGun(): IRifle {
        return new Rifle({
            gunFrame: 1,
            ammo: 15,
            damage: 15,
            fireRate: 2,
            distance: 5,
            price: 300
        });
    }
    CreateHighTierGun(): IRifle {
        return new Rifle({
            gunFrame: 15,
            ammo: 15,
            damage: 15,
            fireRate: 3,
            distance: 6,
            price: 350
        });
    }

}