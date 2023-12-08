import { HealthItem, RemoveBleedingItem, TimeTravelItem } from "../../Models/Items";
import SocketController from "../../SocketController";

export interface IVisitor {
    useHealthItem(item: HealthItem): void
    useRemoveBleedingItem(item: RemoveBleedingItem): void
    useTimeTravelItem(item: TimeTravelItem): void
}

export class ItemVisitor implements IVisitor{
    private socketInstance : SocketController;
    private sceneEvents : Phaser.Events.EventEmitter;

    constructor(socketInstance : SocketController, sceneEvents : Phaser.Events.EventEmitter){
        this.socketInstance = socketInstance;
        this.sceneEvents = sceneEvents;
    }

    public useHealthItem(item : HealthItem) : void {
        this.socketInstance.healPlayer(item.useEffect());
    }
    public useRemoveBleedingItem(item: RemoveBleedingItem): void {
        this.socketInstance.healPlayer(item.useEffect());
    }
    public useTimeTravelItem(item: TimeTravelItem): void {
        this.sceneEvents.emit(item.useEffect());
    }
}

export class BoostedItemVisitor implements IVisitor{
    private socketInstance : SocketController;
    private sceneEvents : Phaser.Events.EventEmitter;

    constructor(socketInstance : SocketController, sceneEvents : Phaser.Events.EventEmitter){
        this.socketInstance = socketInstance;
        this.sceneEvents = sceneEvents;
    }

    public useHealthItem(item : HealthItem) : void {
        this.socketInstance.healPlayer(item.useEffect() + 10);
    }
    public useRemoveBleedingItem(item: RemoveBleedingItem): void {
        this.socketInstance.healPlayer(item.useEffect());
    }

    public useTimeTravelItem(item: TimeTravelItem): void {
        this.sceneEvents.emit(item.useEffect());
    }
}

export class SuperBoostedItemVisitor implements IVisitor{
    private socketInstance : SocketController;
    private sceneEvents : Phaser.Events.EventEmitter;

    constructor(socketInstance : SocketController, sceneEvents : Phaser.Events.EventEmitter){
        this.socketInstance = socketInstance;
        this.sceneEvents = sceneEvents;
    }

    public useHealthItem(item : HealthItem) : void {
        this.socketInstance.healPlayer(item.useEffect() + 20);
    }
    public useRemoveBleedingItem(item: RemoveBleedingItem): void {
        this.socketInstance.healPlayer(item.useEffect());
    }

    public useTimeTravelItem(item: TimeTravelItem): void {
        this.sceneEvents.emit(item.useEffect());
    }
}