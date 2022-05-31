import { Component } from '@angular/core';
import { WidgetService } from '../../services/widget/widget.service';

@Component({
  selector: 'column-properties',
  templateUrl: './column-properties.component.html',
  styleUrls: ['./column-properties.component.scss']
})
export class ColumnPropertiesComponent {

  constructor(public widgetService: WidgetService) { }

  update() {
    // this.widgetService.$update.next();
  }


  updateColumnSpan() {
    this.widgetService.selectedColumn.updateColumnSpan();
    this.update();
}
}