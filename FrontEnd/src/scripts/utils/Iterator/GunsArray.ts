import { IGun } from "../../Interfaces/Guns/IGun";
import AggregateArray from "./AggregateArray";
import GunsIterator from "./GunsIterator";
import Iterator from "./Iterator"

export default class GunsArray implements AggregateArray {
    
    public items: Array<IGun>
    constructor(items: Array<IGun>){
        this.items = items;
    }
    public getIterator(): GunsIterator
    {
        return new GunsIterator(this.items);
    }
}