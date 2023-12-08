import Iterator from "./Iterator"

export default interface AggregateArray {
    items: Array<any>
    getIterator(): Iterator<any>
}