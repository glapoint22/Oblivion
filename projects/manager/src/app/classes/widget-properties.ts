import { Directive, DoCheck } from "@angular/core";
import { Padding, Widget } from "widgets";
import { WidgetService } from "../services/widget/widget.service";

@Directive()
export class WidgetProperties<T extends Widget> implements DoCheck {
    public widget!: T

    constructor(public widgetService: WidgetService) { }

    ngDoCheck(): void {
        this.widget = this.widgetService.selectedWidget as T;
    }

    update() {
        // this.widgetService.$update.next();
    }

    updateColumnSpan() {
        this.widgetService.selectedColumn.updateColumnSpan();
        this.update();
    }


    updatePadding(padding: Padding) {
        padding.setClasses(this.widget.widgetElement);
        this.update();
    }
}