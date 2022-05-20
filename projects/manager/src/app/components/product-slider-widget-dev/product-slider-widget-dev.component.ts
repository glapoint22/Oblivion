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

  ngOnInit(): void {
    super.ngOnInit();
    this.caption.text = 'Check out these products!';
    this.caption.fontSize = this.caption.fontSizes[8];
    this.caption.color = '#ffba00';
  }
}