import { Background } from "./background";
import { Border } from "./border";
import { Column } from "./column";
import { Corners } from "./corners";
import { Padding } from "./padding";
import { Shadow } from "./shadow";
import { VerticalAlignment } from "./vertical-alignment";

export class Row {
    public columns: Array<Column> = new Array<Column>();
    public background!: Background;
    public border!: Border;
    public corners!: Corners;
    public shadow!: Shadow;
    public padding!: Padding;
    public verticalAlignment!: VerticalAlignment;
    public relativeTop!: number;

    constructor(public top: number) { }
}