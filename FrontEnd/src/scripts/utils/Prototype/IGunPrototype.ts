import { IGun } from "../../Interfaces/Guns/IGun";

export interface IGunPrototype {
    clone() : IGun;
}