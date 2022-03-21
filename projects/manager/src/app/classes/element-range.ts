export class ElementRange {
    public inTopParentRange!: boolean;
    public inRange!: boolean;

    constructor
        (
            public containerId: string,
            public startElementId: string,
            public startOffset: number,
            public endElementId: string,
            public endOffset: number,
            public topParentId: string
        ) { }
}