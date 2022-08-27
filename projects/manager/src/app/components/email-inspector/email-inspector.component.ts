import { Component } from '@angular/core';
import { WidgetInspectorView } from '../../classes/enums';
import { WidgetService } from '../../services/widget/widget.service';

@Component({
  selector: 'email-inspector',
  templateUrl: './email-inspector.component.html',
  styleUrls: ['./email-inspector.component.scss']
})
export class EmailInspectorComponent {
  public widgetInspectorView = WidgetInspectorView;

  constructor(public widgetService: WidgetService) { }
}