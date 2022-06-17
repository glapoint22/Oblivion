import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { SummaryProduct } from 'common';
import { Caption } from '../../classes/caption';
import { ProductSliderWidgetData } from '../../classes/product-slider-widget-data';
import { Widget } from '../../classes/widget';
import { WidgetType } from '../../classes/widget-enums';

@Component({
  selector: 'product-slider-widget',
  templateUrl: './product-slider-widget.component.html',
  styleUrls: ['./product-slider-widget.component.scss']
})
export class ProductSliderWidgetComponent extends Widget implements AfterViewInit {
  @Input() products!: Array<SummaryProduct>;
  @Input() text!: string;
  @Input() clientWidth!: number;
  @ViewChild('sliderContainer') sliderContainer!: ElementRef<HTMLElement>;
  public productGroups: Array<any> = []
  public changeCount: number = 0;
  public caption: Caption = new Caption();




  // -------------------------------------------------------------- Ng On Init ------------------------------------------------------------
  ngOnInit() {
    this.type = WidgetType.ProductSlider;
  }



  // ------------------------------------------------------------ Ng On Changes -----------------------------------------------------------
  ngOnChanges() {
    if (this.sliderContainer) {
      this.productGroups = [];
      this.setProductGroups();
      this.changeCount++;
    };

    if (!this.caption.text) this.caption.text = this.text;
  }


  // ------------------------------------------------------------ Set Widget -----------------------------------------------------------
  setWidget(productSliderWidgetData: ProductSliderWidgetData) {
    // Set the defaults
    this.caption.text = 'Check out these products!';
    this.caption.fontSize = this.caption.fontSizes[8];
    this.caption.font = this.caption.fontOptions[0];
    this.caption.color = '#ffba00';

    this.products = productSliderWidgetData.products && productSliderWidgetData.products.length > 0 ? productSliderWidgetData.products : [];
    this.caption.setData(productSliderWidgetData.caption);

    window.addEventListener('resize', this.onWindowResize);
  }




  // ------------------------------------------------------------ Ng After View Init -----------------------------------------------------------
  ngAfterViewInit() {
    super.ngAfterViewInit();
    if (this.products) this.setProductGroups();
  }





  // ------------------------------------------------------------ Set Product Groups -----------------------------------------------------------
  setProductGroups() {
    if (this.sliderContainer) {
      const productsPerGroup = Math.round(this.sliderContainer.nativeElement.clientWidth / 250);

      for (let i = 0; i < this.products.length; i++) {
        if (i % productsPerGroup == 0) this.productGroups.push([]);

        this.productGroups[this.productGroups.length - 1].push(this.products[i]);
      }
    }
  }


  // ------------------------------------------------------------ On Window Resize -----------------------------------------------------------
  onWindowResize = () => {
    this.ngOnChanges();
  }


  // ------------------------------------------------------------ Ng On Destroy -----------------------------------------------------------
  ngOnDestroy() {
    window.removeEventListener('resize', this.onWindowResize);
  }


  // ------------------------------------------------------------ Get Data -----------------------------------------------------------
  getData(): ProductSliderWidgetData {
    const productSliderWidgetData = super.getData() as ProductSliderWidgetData;

    productSliderWidgetData.caption = this.caption.getData();

    return productSliderWidgetData;
  }
}