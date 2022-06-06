import { Directive, DoCheck } from "@angular/core";
import { Widget } from "widgets";
import { Properties } from "./properties";

@Directive()
export class WidgetProperties<T extends Widget> extends Properties implements DoCheck {
    public widget!: T

    ngDoCheck(): void {
        this.widget = this.widgetService.selectedWidget as T;
    }
}