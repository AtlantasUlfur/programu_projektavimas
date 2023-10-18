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
                this.scene.playerCount = payload;
            });
            this.socket.on("lobbyStatus", (payload) =>{
                const mainMenuScene = this.scene as MainMenuScene
                console.log(payload);
                mainMenuScene.lobbyStatus = payload;
            });
            this.socket.on("gameStart", (payload) =>{
                // const mainMenuScene = this.scene as MainScene
                // console.log(payload);
                // mainMenuScene.lobbyStatus = payload;
            });
        }
    }

    public getSocket(): Socket | null {
        return this.socket;
    }

    public createLobby(name : string | null){
        this.socket?.emit("createLobby", {name})
    }

    public joinLobby(name : string | null){
        this.socket?.emit("joinLobby", {name})
    }

    public startGame(lobbyName){
        this.socket?.emit("startGame", {lobbyName})
    }

}