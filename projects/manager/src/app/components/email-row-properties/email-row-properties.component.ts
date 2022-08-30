import { Component } from '@angular/core';
import { Properties } from '../../classes/properties';

@Component({
  selector: 'email-row-properties',
  templateUrl: './email-row-properties.component.html',
  styleUrls: ['./email-row-properties.component.scss']
})
export class EmailRowPropertiesComponent extends Properties {

  updateVerticalAlignment() {
    this.widgetService.selectedRow.verticalAlignment.setClasses(this.widgetService.selectedRow.rowElement);
    this.update();
  }
}