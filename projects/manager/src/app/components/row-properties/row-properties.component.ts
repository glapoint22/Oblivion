import { Component } from '@angular/core';
import { WidgetService } from '../../services/widget/widget.service';

@Component({
  selector: 'row-properties',
  templateUrl: './row-properties.component.html',
  styleUrls: ['./row-properties.component.scss']
})
export class RowPropertiesComponent {

  constructor(public widgetService: WidgetService) { }

  update() {
    // this.widgetService.$update.next();
  }
}