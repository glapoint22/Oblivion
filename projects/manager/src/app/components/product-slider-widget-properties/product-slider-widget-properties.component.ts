import { Component } from '@angular/core';
import { WidgetProperties } from '../../classes/widget-properties';
import { ProductSliderWidgetDevComponent } from '../product-slider-widget-dev/product-slider-widget-dev.component';

@Component({
  selector: 'product-slider-widget-properties',
  templateUrl: './product-slider-widget-properties.component.html',
  styleUrls: ['./product-slider-widget-properties.component.scss']
})
export class ProductSliderWidgetPropertiesComponent extends WidgetProperties<ProductSliderWidgetDevComponent>  { }