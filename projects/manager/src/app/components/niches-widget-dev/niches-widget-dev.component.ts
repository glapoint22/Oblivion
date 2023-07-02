import { Component } from '@angular/core';
import { NichesWidgetComponent } from 'widgets';
import { WidgetInspectorView } from '../../classes/enums';
import { WidgetService } from '../../services/widget/widget.service';

@Component({
  selector: 'niches-widget-dev',
  templateUrl: './niches-widget-dev.component.html',
  styleUrls: ['./niches-widget-dev.component.scss']
})
export class NichesWidgetDevComponent extends NichesWidgetComponent {
  public currentNicheIndex: number = 0;
  public widgetInspectorView = WidgetInspectorView;

  constructor(public widgetService: WidgetService) { super() }
}