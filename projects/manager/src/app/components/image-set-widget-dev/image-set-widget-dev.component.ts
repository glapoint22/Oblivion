import { Component } from '@angular/core';
import { ImageSetWidgetComponent } from 'widgets';
import { WidgetInspectorView } from '../../classes/enums';
import { WidgetService } from '../../services/widget/widget.service';

@Component({
  selector: 'image-set-widget-dev',
  templateUrl: './image-set-widget-dev.component.html',
  styleUrls: ['./image-set-widget-dev.component.scss']
})
export class ImageSetWidgetDevComponent extends ImageSetWidgetComponent {
  public currentImageIndex: number = 0;
  public widgetInspectorView = WidgetInspectorView;

  constructor(public widgetService: WidgetService) { super() }
}