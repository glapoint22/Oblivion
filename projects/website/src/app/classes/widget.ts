import { Directive, ElementRef, ViewChild } from "@angular/core";
import { Breakpoint } from "./breakpoint";
import { WidgetType } from "./enums";
import { HorizontalAlignment } from "./horizontal-alignment";

@Directive()
export class Widget {
    @ViewChild('widget') private widgetElementRef!: ElementRef<HTMLElement>;
    public widgetElement!: HTMLElement;
    public widgetType!: WidgetType;
    public width!: number;
    public height!: number;
    public horizontalAlignment!: string;
    public breakpoints!: Array<Breakpoint>;

    ngAfterViewInit() {
        this.widgetElement = this.widgetElementRef.nativeElement;
        const horizontalAlignment = new HorizontalAlignment(this.horizontalAlignment);
        horizontalAlignment.addClasses(this.widgetElement, this.breakpoints);
    }


    setWidget(widget: Widget) {
        if (widget.width) this.width = widget.width;
        if (widget.height) this.height = widget.height;
        this.horizontalAlignment = widget.horizontalAlignment;
        this.breakpoints = widget.breakpoints;
    }
}