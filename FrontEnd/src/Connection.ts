import { io, Socket } from 'socket.io-client';
export class Connection
{
    private static _instance : Connection | null = null;
    private socket : Socket | null = null;

    private constructor(){}

    public static getInstance(): Connection {
        if (!Connection._instance) {
            Connection._instance = new Connection();
        }
        return Connection._instance;
    }
    
    public connect(url: string): void {
        if (!this.socket) {
            this.socket = io(url);
        }
    }

    private getSocket(): Socket | null {
        return this.socket;
    }
}