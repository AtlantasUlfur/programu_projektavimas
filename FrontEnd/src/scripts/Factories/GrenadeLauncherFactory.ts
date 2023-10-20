import { IAbstractGunFactory } from "../AbstractFactories/IAbstractGunFactory";
import { IGrenadeLauncher } from "../ModelInterfaces/Guns/IGrenadeLauncher";
import { IGun } from "../ModelInterfaces/Guns/IGun";
import { GrenadeLauncher } from "../Models/Guns/GrenadeLauncher";

export class GrenadeLauncherFactory implements IAbstractGunFactory
{
    CreateWeakGun(): IGrenadeLauncher {
        return new GrenadeLauncher(
            6, 7, 10, 15
        );
    }
    CreateMiddleTierGun(): IGrenadeLauncher {
        return new GrenadeLauncher(
            10, 7, 15, 20
        );
    }
    CreateHighTierGun(): IGrenadeLauncher {
        return new GrenadeLauncher(
            10, 7, 25, 25
        );
    }
    
}