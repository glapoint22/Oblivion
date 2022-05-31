import { Directive, ElementRef, ViewChild } from "@angular/core";
import { HorizontalAlignment } from "./horizontal-alignment";
import { WidgetData } from "./widget-data";
import { WidgetType } from "./widget-enums";

@Directive()
export abstract class Widget {
    @ViewChild('widget') private widgetElementRef!: ElementRef<HTMLElement>;
    public type!: WidgetType;
    public widgetElement!: HTMLElement;
    public width!: number;
    public height!: number;
    public horizontalAlignment: HorizontalAlignment = new HorizontalAlignment();


    // ------------------------------------------------------------ Ng After View Init -----------------------------------------------------------
    ngAfterViewInit() {
        this.widgetElement = this.widgetElementRef.nativeElement;
        this.horizontalAlignment.setClasses(this.widgetElement);
    }


    // ------------------------------------------------------------ Set Widget -----------------------------------------------------------
    setWidget(widgetData: WidgetData) {
        if (widgetData.width) this.width = widgetData.width;
        if (widgetData.height) this.height = widgetData.height;
        this.horizontalAlignment.setData(widgetData.horizontalAlignment);
    }


    // ------------------------------------------------------------ Get Data -----------------------------------------------------------
    abstract getData(): WidgetData;
}