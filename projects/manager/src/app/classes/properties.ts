import { Directive } from "@angular/core";
import { Padding } from "widgets";
import { WidgetService } from "../services/widget/widget.service";

@Directive()
export class Properties {

    constructor(public widgetService: WidgetService) { }

    update() {
        this.widgetService.page.save();
    }

    updatePadding(padding: Padding, element: HTMLElement) {
        padding.setClasses(element);
        this.update();
    }
}