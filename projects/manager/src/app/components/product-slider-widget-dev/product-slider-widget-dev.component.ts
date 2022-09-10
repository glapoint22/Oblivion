import { Component } from '@angular/core';
import { ProductSliderWidgetComponent } from 'widgets';
import { WidgetInspectorView } from '../../classes/enums';
import { ProductSliderWidgetDevData } from '../../classes/product-slider-widget-dev-data';
import { Query } from '../../classes/query';
import { WidgetService } from '../../services/widget/widget.service';

@Component({
  selector: 'product-slider-widget-dev',
  templateUrl: './product-slider-widget-dev.component.html',
  styleUrls: ['./product-slider-widget-dev.component.scss']
})
export class ProductSliderWidgetDevComponent extends ProductSliderWidgetComponent {
  public query: Query = new Query();
  public widgetInspectorView = WidgetInspectorView;

  constructor(public widgetService: WidgetService) { super() }


  // ------------------------------------------------------------ Get Data -----------------------------------------------------------
  getData(): ProductSliderWidgetDevData {
    const productSliderWidgetDevData = super.getData() as ProductSliderWidgetDevData;

    productSliderWidgetDevData.query = this.query;
    return productSliderWidgetDevData;
  }





  // ------------------------------------------------------------ Set Widget -----------------------------------------------------------
  setWidget(productSliderWidgetDevData: ProductSliderWidgetDevData) {
    super.setWidget(productSliderWidgetDevData);

    if (productSliderWidgetDevData.query) {
      this.query = new Query(productSliderWidgetDevData.query.elements);
    }
  }
}