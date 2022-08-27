import { Component } from '@angular/core';
import { Properties } from '../../classes/properties';

@Component({
  selector: 'email-column-properties',
  templateUrl: './email-column-properties.component.html',
  styleUrls: ['./email-column-properties.component.scss']
})
export class EmailColumnPropertiesComponent extends Properties {

  updateHorizontalAlignment() {
    this.widgetService.selectedColumn.horizontalAlignment.setClasses(this.widgetService.selectedWidget.widgetElement);
    this.update();
  }
}