import * as Phaser from 'phaser'
import SocketController from "../../SocketController"


export abstract class BaseScene extends Phaser.Scene{
    //Utils
    protected socketInstance: SocketController
    
    protected init(data?: any):void {
        this.socketInstance = SocketController.getInstance()
        this.socketInstance.setScene(this)
    } 
    protected preload():void {} //hook
    protected create():void {} //hook
    abstract update(time? : number, delta?: number) : void; //must be implemented

}