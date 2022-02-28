import { Directive, ElementRef, ViewChild } from "@angular/core";
import { HorizontalAlignment } from "./horizontal-alignment";
import { WidgetData } from "./widget-data";

@Directive()
export class Widget {
    @ViewChild('widget') private widgetElementRef!: ElementRef<HTMLElement>;
    public widgetElement!: HTMLElement;
    public width!: number;
    public height!: number;
    private horizontalAlignment!: HorizontalAlignment;

    ngAfterViewInit() {
        this.widgetElement = this.widgetElementRef.nativeElement;
        this.horizontalAlignment.setClass(this.widgetElement);
    }


    setWidget(widgetData: WidgetData) {
        if (widgetData.width) this.width = widgetData.width;
        if (widgetData.height) this.height = widgetData.height;
        this.horizontalAlignment = new HorizontalAlignment(widgetData.horizontalAlignment);
    }
}