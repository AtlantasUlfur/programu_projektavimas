export default interface Iterator<T> {
    first(): T
    next(): T
    hasNext(): boolean
    previous(): T
    hasPrevious(): boolean
}