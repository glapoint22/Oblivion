import { WidgetType } from "widgets";
import { WidgetCursorType } from "./enums";

export class WidgetCursor {
    public name!: string;
    public widgetType!: WidgetType;
    public className!: string;
    public unicode!: string;
    public fontSize!: string;
    public y!: number;
    public x!: number;
    public widgetCursorType!: WidgetCursorType;
    public cursor: string = 'default';
}