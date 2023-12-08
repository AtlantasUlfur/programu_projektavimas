import { HealthItem } from "../../Models/Items";
import SocketController from "../../SocketController";

export interface IVisitor {
    useHealthItem(item: HealthItem, socketInstance : SocketController): void
}

export class ItemVisitor implements IVisitor{
    public useHealthItem(item : HealthItem, socketInstance : SocketController) : void {
        socketInstance.healPlayer(item.useEffect());
    }
}

export class BoostedItemVisitor implements IVisitor{
    public useHealthItem(item : HealthItem, socketInstance : SocketController) : void {
        socketInstance.healPlayer(item.useEffect() + 10);
    }
}

export class SuperBoostedItemVisitor implements IVisitor{
    public useHealthItem(item : HealthItem, socketInstance : SocketController) : void {
        socketInstance.healPlayer(item.useEffect() + 20);
    }
}