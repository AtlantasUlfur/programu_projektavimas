import { IItem } from "../Interfaces/IItem";
import SocketController from "../SocketController";
import { BaseEffect } from "../utils/Template/BaseEffect";
import { IVisitor } from "../utils/Visitor/Visitor";

export class HealthItem implements IItem{
    private Texture : string;
    private BaseEffect : BaseEffect;
    private Visitor : IVisitor;

    constructor(texture : string, baseEffect : BaseEffect, visitor : IVisitor){
        this.Texture = texture;
        this.BaseEffect = baseEffect;
        this.Visitor = visitor;
    }
    getTexture(): string {
        return this.Texture;
    }
    
    public use(): void {
        this.Visitor.useHealthItem(this);
    }

    public useEffect(): number {
        return this.BaseEffect.templateMethod();
    }
}

export class RemoveBleedingItem implements IItem{
    private Texture : string;
    private BaseEffect : BaseEffect;
    private Visitor : IVisitor;

    constructor(texture : string, baseEffect : BaseEffect, visitor : IVisitor){
        this.Texture = texture;
        this.BaseEffect = baseEffect;
        this.Visitor = visitor;
    }
    getTexture(): string {
        return this.Texture;
    }
    
    public use(): void {
        this.Visitor.useRemoveBleedingItem(this);
    }

    public useEffect(): number {
        return this.BaseEffect.templateMethod();
    }
}

export class TimeTravelItem implements IItem{
    private Texture : string;
    private BaseEffect : BaseEffect;
    private Visitor : IVisitor;

    constructor(texture : string, baseEffect : BaseEffect, visitor : IVisitor){
        this.Texture = texture;
        this.BaseEffect = baseEffect;
        this.Visitor = visitor;
    }
    getTexture(): string {
        return this.Texture;
    }
    
    public use(): void {
        this.Visitor.useTimeTravelItem(this);
    }

    public useEffect(): string {
        return this.BaseEffect.templateMethod();
    }
}