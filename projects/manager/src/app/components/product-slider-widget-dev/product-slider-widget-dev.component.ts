import { Component } from '@angular/core';
import { ProductSliderWidgetComponent } from 'widgets';
import { WidgetInspectorView } from '../../classes/enums';
import { WidgetService } from '../../services/widget/widget.service';

@Component({
  selector: 'product-slider-widget-dev',
  templateUrl: './product-slider-widget-dev.component.html',
  styleUrls: ['./product-slider-widget-dev.component.scss']
})
export class ProductSliderWidgetDevComponent extends ProductSliderWidgetComponent {
  public widgetInspectorView = WidgetInspectorView;

  constructor(public widgetService: WidgetService) { super() }
}