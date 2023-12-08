import { BaseEffect } from "./BaseEffect";

export class HealthEffect extends BaseEffect{
    private HealthPoints : number;

    protected initialise(): void {
        this.HealthPoints = 0;
    }

    protected setEffect(): void {
        this.HealthPoints = 10;
    }

    protected override applyEffect(): number {
        return this.HealthPoints;
    }
}

export class TimeTravelEffect extends BaseEffect{
    private command : string;

    protected initialise(): void {
        this.command = "";
    }

    protected setEffect(): void {
        this.command = "Undo";
    }

    protected override applyEffect(): string {
        return this.command;
    }
}