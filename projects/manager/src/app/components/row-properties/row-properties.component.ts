import { Component } from '@angular/core';
import { Properties } from '../../classes/properties';

@Component({
  selector: 'row-properties',
  templateUrl: './row-properties.component.html',
  styleUrls: ['./row-properties.component.scss']
})
export class RowPropertiesComponent extends Properties { 

  updateVerticalAlignment() {
    this.widgetService.selectedRow.verticalAlignment.setClasses(this.widgetService.selectedRow.rowElement);
    this.update();
  }
}