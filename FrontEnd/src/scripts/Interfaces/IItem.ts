import SocketController from "../SocketController";
import { IVisitor } from "../utils/Visitor/Visitor";

export interface IItem {
    use() : void;
    getTexture() : string;
}