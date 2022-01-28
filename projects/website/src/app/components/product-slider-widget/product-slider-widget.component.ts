import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Caption } from '../../classes/caption';
import { Product } from '../../classes/product';
import { ProductSliderWidgetData } from '../../classes/product-slider-widget-data';
import { Widget } from '../../classes/widget';

@Component({
  selector: 'product-slider-widget',
  templateUrl: './product-slider-widget.component.html',
  styleUrls: ['./product-slider-widget.component.scss']
})
export class ProductSliderWidgetComponent extends Widget implements AfterViewInit {
  @Input() products!: Array<Product>;
  @Input() caption!: Caption;
  @Input() clientWidth!: number;
  @ViewChild('sliderContainer') sliderContainer!: ElementRef<HTMLElement>;
  public productGroups: Array<any> = []
  public changeCount: number = 0;

  ngOnChanges() {
    if (this.sliderContainer) {
      this.productGroups = [];
      this.setProductGroups();
      this.changeCount++;
    };
  }

  setWidget(productSliderWidgetData: ProductSliderWidgetData) {
    this.products = productSliderWidgetData.products;
    this.caption = productSliderWidgetData.caption;

    window.addEventListener('resize', this.onWindowResize);
  }

  ngAfterViewInit() {
    this.setProductGroups();
  }


  setProductGroups() {
    if (this.sliderContainer) {
      const productsPerGroup = Math.round(this.sliderContainer.nativeElement.clientWidth / 250);

      for (let i = 0; i < this.products.length; i++) {
        if (i % productsPerGroup == 0) this.productGroups.push([]);

        this.productGroups[this.productGroups.length - 1].push(this.products[i]);
      }
    }
  }


  onWindowResize = () => {
    this.ngOnChanges();
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.onWindowResize);
  }
}