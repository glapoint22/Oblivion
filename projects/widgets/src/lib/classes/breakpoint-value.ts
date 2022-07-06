export interface BreakpointValue<T> {
    getValue(): T;
    setValue(value: T): void;
}