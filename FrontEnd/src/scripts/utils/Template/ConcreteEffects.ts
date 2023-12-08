import { BaseEffect } from "./BaseEffect";

export class HealthEffect extends BaseEffect{
    private HealthPoints : number;

    protected initialise(): void {
        this.HealthPoints = 10;
    }

    protected override applyEffect(): number {
        return this.HealthPoints;
    }
}