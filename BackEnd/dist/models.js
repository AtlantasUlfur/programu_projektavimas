"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerMemento = void 0;
class PlayerMemento {
    constructor(position, health, isTurn, moveOrder) {
        this.position = Object.assign({}, position);
        this.health = health;
        this.isTurn = isTurn;
        this.moveOrder = moveOrder;
    }
    getPosition() {
        return this.position;
    }
    getHealth() {
        return this.health;
    }
    getTurnStatus() {
        return this.isTurn;
    }
    getMoveOrder() {
        return this.moveOrder;
    }
}
exports.PlayerMemento = PlayerMemento;
