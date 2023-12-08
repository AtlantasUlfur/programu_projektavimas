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
    
    public use(socketInstance : SocketController): void {
        this.Visitor.useHealthItem(this, socketInstance);
    }

    public useEffect(): number {
        return this.BaseEffect.templateMethod();
    }

}