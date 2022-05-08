import { Component } from '@angular/core';
import { ProductSliderWidgetComponent } from 'widgets';
import { WidgetService } from '../../services/widget/widget.service';

@Component({
  selector: 'product-slider-widget-dev',
  templateUrl: './product-slider-widget-dev.component.html',
  styleUrls: ['./product-slider-widget-dev.component.scss']
})
export class ProductSliderWidgetDevComponent extends ProductSliderWidgetComponent {
  constructor(public widgetService: WidgetService) { super() }
}