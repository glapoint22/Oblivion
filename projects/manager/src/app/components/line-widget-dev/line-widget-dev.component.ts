import { Component } from '@angular/core';
import { LineWidgetComponent } from 'widgets';
import { WidgetService } from '../../services/widget/widget.service';

@Component({
  selector: 'line-widget-dev',
  templateUrl: './line-widget-dev.component.html',
  styleUrls: ['./line-widget-dev.component.scss']
})
export class LineWidgetDevComponent extends LineWidgetComponent {

  constructor(public widgetService: WidgetService) { super() }
}