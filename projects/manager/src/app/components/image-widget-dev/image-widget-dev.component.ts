import { Component } from '@angular/core';
import { ImageWidgetComponent } from 'widgets';
import { WidgetService } from '../../services/widget/widget.service';

@Component({
  selector: 'image-widget-dev',
  templateUrl: './image-widget-dev.component.html',
  styleUrls: ['./image-widget-dev.component.scss']
})
export class ImageWidgetDevComponent extends ImageWidgetComponent {

  constructor(public widgetService: WidgetService) { super() }

}