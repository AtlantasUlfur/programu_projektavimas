import { io, Socket } from "socket.io-client";

//Singleton
export default class  SocketController
{
    private static _instance : SocketController | null = null;
    private socket : Socket | null = null;

    private playerCount : integer = 0;

    private constructor(){}

    public static getInstance(): SocketController {
        if (!SocketController._instance) {
            SocketController._instance = new SocketController();
        }
        return SocketController._instance;
    }
    
    public connect(url: string): void {
        if (!this.socket) {
            this.socket = io(url);

            this.socket.on("getPlayers", (payload) =>{
                this.playerCount = payload.playerCount;
            });
        }
    }

    public getSocket(): Socket | null {
        return this.socket;
    }

    public createLobby(name : string){
        this.socket.emit("createLobby", {name})
    }

    public getPlayers(){
        return this.playerCount;
    }
}