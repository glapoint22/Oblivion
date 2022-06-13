import { Component } from '@angular/core';
import { WidgetInspectorView } from '../../classes/enums';
import { WidgetService } from '../../services/widget/widget.service';

@Component({
  selector: 'widget-inspector',
  templateUrl: './widget-inspector.component.html',
  styleUrls: ['./widget-inspector.component.scss']
})
export class WidgetInspectorComponent {
  public widgetInspectorView = WidgetInspectorView;

  constructor(public widgetService: WidgetService) { }
}