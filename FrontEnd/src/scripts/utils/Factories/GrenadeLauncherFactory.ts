import { IAbstractGunFactory } from "../AbstractFactories/IAbstractGunFactory";
import { IGrenadeLauncher } from "../../Interfaces/Guns/IGrenadeLauncher";
import { IGun } from "../../Interfaces/Guns/IGun";
import { GrenadeLauncher } from "../../Models/Guns/GrenadeLauncher";

export class GrenadeLauncherFactory implements IAbstractGunFactory
{
    CreateWeakGun(): IGrenadeLauncher {
        return new GrenadeLauncher({
            gunFrame: 6,
            ammo: 7,
            explosionRadius: 10,
            damage: 15,
            distance: 2,
            price: 100
        });
    }

    CreateMiddleTierGun(): IGrenadeLauncher {
        return new GrenadeLauncher({
            gunFrame: 6,
            ammo: 7,
            explosionRadius: 15,
            damage: 20,
            distance: 3,
            price: 200
        });
    }

    CreateHighTierGun(): IGrenadeLauncher {
        return new GrenadeLauncher({
            gunFrame: 10,
            ammo: 7,
            explosionRadius: 25,
            damage: 25,
            distance: 3,
            price: 300
        });
    }
    
}