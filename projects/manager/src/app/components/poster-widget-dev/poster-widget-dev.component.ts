import { Component } from '@angular/core';
import { WidgetInspectorView } from '../../classes/enums';
import { WidgetService } from '../../services/widget/widget.service';
import { PosterWidgetComponent } from 'widgets';

@Component({
  selector: 'poster-widget-dev',
  templateUrl: './poster-widget-dev.component.html',
  styleUrls: ['./poster-widget-dev.component.scss']
})
export class PosterWidgetDevComponent extends PosterWidgetComponent {
  public widgetInspectorView = WidgetInspectorView;

  constructor(public widgetService: WidgetService) { super() }
}