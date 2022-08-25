import { Component } from '@angular/core';
import { Properties } from '../../classes/properties';

@Component({
  selector: 'page-row-properties',
  templateUrl: './page-row-properties.component.html',
  styleUrls: ['./page-row-properties.component.scss']
})
export class PageRowPropertiesComponent extends Properties { 

  updateVerticalAlignment() {
    this.widgetService.selectedRow.verticalAlignment.setClasses(this.widgetService.selectedRow.rowElement);
    this.update();
  }
}