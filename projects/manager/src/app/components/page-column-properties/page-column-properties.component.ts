import { Component } from '@angular/core';
import { Properties } from '../../classes/properties';

@Component({
  selector: 'page-column-properties',
  templateUrl: './page-column-properties.component.html',
  styleUrls: ['./page-column-properties.component.scss']
})
export class PageColumnPropertiesComponent extends Properties {
  
  updateHorizontalAlignment() {
    this.widgetService.selectedColumn.horizontalAlignment.setClasses(this.widgetService.selectedWidget.widgetElement);
    this.update();
  }

  updateColumnSpan() {
    this.widgetService.selectedColumn.updateColumnSpan();
    this.update();
}
}