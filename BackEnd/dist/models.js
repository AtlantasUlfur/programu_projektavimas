"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CareTaker = exports.PlayerMemento = void 0;
class PlayerMemento {
    constructor(state, position, health, isTurn, moveOrder) {
        this.position = Object.assign({}, position);
        this.health = health;
        this.isTurn = isTurn;
        this.moveOrder = moveOrder;
        this.state = state;
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
class CareTaker {
    constructor() {
        this.history = [];
    }
    save(momento) {
        console.log(this.history[0]);
        let found = false;
        for (let i = 0; i < this.history.length; i++) {
            if (this.history[i].state === momento.state) {
                this.history[i] = momento;
                found = true;
                break;
            }
        }
        if (!found) {
            this.history.push(momento);
        }
    }
    undo(state) {
        for (const element of this.history) {
            if (element.state === state) {
                return element;
            }
        }
        return null;
    }
}
exports.CareTaker = CareTaker;
