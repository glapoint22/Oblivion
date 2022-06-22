import { ColumnSpanValue } from "./column-span-value";

export class ColumnSpan {
    public values: Array<ColumnSpanValue> = []

    constructor(columnSpan?: number) {
        if (columnSpan) this.values.push(new ColumnSpanValue(columnSpan));
    }


    getData(): ColumnSpan {
        if (this.values.length == 0) return null!;
        const columnSpan = new ColumnSpan();

        columnSpan.values = [];
        this.values.forEach((columnSpanValue: ColumnSpanValue) => {
            columnSpan.values.push(new ColumnSpanValue(columnSpanValue.span, columnSpanValue.breakpoint));
        });

        return columnSpan;
    }


    setData(columnSpan: ColumnSpan) {
        if (columnSpan) {
            if (columnSpan.values) this.values = columnSpan.values;
        } else {
            this.values.push(new ColumnSpanValue(12));
        }
    }



    setClasses(element: HTMLElement) {
        // Get a list of all current column span classes
        const classes = element.className.match(/col-[0-9]+[\-a-z]*/g);

        // Remove the column span classes
        classes?.forEach(x => {
            element.classList.remove(x);
        });

        // Add the new classes
        this.values.forEach((value: ColumnSpanValue) => {
            element.classList.add('col-' + value.span +
                (value.breakpoint ? '-' + value.breakpoint : ''));
        });
    }
}