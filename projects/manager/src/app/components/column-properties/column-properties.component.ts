import { Component } from '@angular/core';
import { Properties } from '../../classes/properties';

@Component({
  selector: 'column-properties',
  templateUrl: './column-properties.component.html',
  styleUrls: ['./column-properties.component.scss']
})
export class ColumnPropertiesComponent extends Properties {
  
  updateHorizontalAlignment() {
    this.widgetService.selectedColumn.horizontalAlignment.setClasses(this.widgetService.selectedWidget.widgetElement);
    this.update();
  }

  updateColumnSpan() {
    this.widgetService.selectedColumn.updateColumnSpan();
    this.update();
}
}