import { IGun } from "../../Interfaces/Guns/IGun";
import AggregateList from "./AggregateArray";
import Iterator from "./Iterator"

export default class GunsIterator implements Iterator<IGun> {
    private items: Array<IGun>
    private currentIndex: integer = 0
    constructor(items: Array<IGun>){
        this.items = items;
    }
    public first(){
        return this.items[0];
    }
    public next(){
        this.currentIndex += 1;
        return this.items[this.currentIndex];
    }
    public hasNext(){
        return this.currentIndex < this.items.length
    }
    public hasPrevious(): boolean {
        return this.currentIndex > 0
    }
    public previous(): IGun {
        this.currentIndex -= 1;
        return this.items[this.currentIndex]
    }
}