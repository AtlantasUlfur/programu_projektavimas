import { io, Socket } from "socket.io-client";
import { MainMenuScene } from "./scenes/MainMenuScene";
import MainScene from "./scenes/MainScene";

//Singleton
export default class  SocketController
{
    private static _instance : SocketController | null = null;
    private socket : Socket | null = null;
    private scene : MainMenuScene | MainScene;

    private constructor(){}

    public static getInstance(): SocketController {
        if (!SocketController._instance) {
            SocketController._instance = new SocketController();
        }
        return SocketController._instance;
    }
    
    public connect(url: string, Scene : MainMenuScene | MainScene): void {
        if (!this.socket) {
            this.socket = io(url);
            this.scene = Scene;

            this.socket.on("playerCount", (payload) =>{
                const mainMenuScene = this.scene as MainMenuScene
                mainMenuScene.playerCount = payload;
            });
            this.socket.on("lobbyStatus", (payload) =>{
                const mainMenuScene = this.scene as MainMenuScene
                mainMenuScene.lobbyStatus = payload;
            });
            this.socket.on("gameStart", (payload) =>{
                const mainMenuScene = this.scene as MainMenuScene
                mainMenuScene.scene.start("MainScene", payload);
            });
            this.socket.on("turn", (payload) =>{
                const mainScene = this.scene as MainScene;
                mainScene.playersTurnId = payload;
            });
        }
    }

    public getSocket(): Socket | null {
        return this.socket;
    }

    public setScene(Scene : MainMenuScene | MainScene){
        this.scene = Scene;
    }

    public createLobby(name : string | null){
        this.socket?.emit("createLobby", {name})
    }

    public joinLobby(name : string | null){
        this.socket?.emit("joinLobby", {name})
    }

    public startGame(name : string | null){
        this.socket?.emit("startGame", {name})
    }

    public endTurn(){
        this.socket?.emit("endTurn");
    }

}