import { Directive, ElementRef, ViewChild } from "@angular/core";
import { WidgetData } from "./widget-data";
import { WidgetType } from "./widget-enums";

@Directive()
export class Widget {
    @ViewChild('widget') private widgetElementRef!: ElementRef<HTMLElement>;
    public type!: WidgetType;
    public widgetElement!: HTMLElement;
    public width!: number;
    public height!: number;
    


    // ------------------------------------------------------------ Ng After View Init -----------------------------------------------------------
    ngAfterViewInit() {
        this.widgetElement = this.widgetElementRef.nativeElement;
    }


    // ------------------------------------------------------------ Set Widget -----------------------------------------------------------
    setWidget(widgetData: WidgetData) {
        if (widgetData.width) this.width = widgetData.width;
        if (widgetData.height) this.height = widgetData.height;
        
    }


    // ------------------------------------------------------------ Get Data -----------------------------------------------------------
    public getData(): WidgetData {
        const widgetData = new WidgetData(this.type);

        widgetData.width = this.width;
        widgetData.height = this.height;
        return widgetData;
    }


    getRouterLink(link: string) {
        if (link.includes('?')) {
          const regex = new RegExp(/.+(?=\?)/);
    
          const result = regex.exec(link);
    
          return '/' + result![0];
        }
    
        return link;
      }
    
    
      getQueryParams(link: string) {
        if (link.includes('?')) {
          const regex = new RegExp(/(:?\?|&)([a-zA-Z0-9\-]+)=([a-zA-Z0-9\-]+)/g);
    
          let match;
          let dynamicObject: any = {};
          while ((match = regex.exec(link)) !== null) {
            dynamicObject[match[2]] = match[3];
          }
    
          return dynamicObject;
        }
    
        return null;
      }
}