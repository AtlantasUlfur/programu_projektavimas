import SocketController from "../SocketController";
import { IVisitor } from "../utils/Visitor/Visitor";

export interface IItem {
    use(socketInstance : SocketController): void;
    getTexture() : string;
}