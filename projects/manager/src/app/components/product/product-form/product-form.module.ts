import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductFormComponent } from './product-form.component';
import { PricePointsComponent } from '../product-price-points/price-points/price-points.component';
import { DescriptionComponent } from '../product-description/description/description.component';
import { TextToolbarPopupComponent } from '../../text-toolbar-popup/text-toolbar-popup.component';
import { FormsModule } from '@angular/forms';
import { ColorSwatchModule } from '../../color-swatch/color-swatch.module';
import { RecurringPaymentModule, ShippingModule } from 'common';
import { SubproductsComponent } from '../../subproducts/subproducts.component';
import { IconButtonModule } from '../../icon-button/icon-button.module';
import { DropdownModule } from '../../dropdown/dropdown.module';
import { ProductNameComponent } from '../product-name/product-name.component';
import { ProductPriceComponent } from '../product-price/product-price.component';
import { ProductShippingComponent } from '../product-shipping/product-shipping.component';
import { ProductRecurringPaymentComponent } from '../product-recurring-payment/product-recurring-payment.component';
import { ProductHoplinkComponent } from '../product-hoplink/product-hoplink.component';
import { ProductDescriptionComponent } from '../product-description/product-description.component';
import { ProductMediaListComponent } from '../product-media/product-media-list/product-media-list.component';
import { ProductMediaDisplayComponent } from '../product-media/product-media-display/product-media-display.component';
import { ProductPricePointsComponent } from '../product-price-points/product-price-points.component';
import { PricePointHeaderComponent } from '../product-price-points/price-points/price-point/price-point-header/price-point-header.component';
import { PricePointQuantityComponent } from '../product-price-points/price-points/price-point/price-point-quantity/price-point-quantity.component';
import { PricePointImageComponent } from '../product-price-points/price-points/price-point/price-point-image/price-point-image.component';
import { PricePointUnitPriceComponent } from '../product-price-points/price-points/price-point/price-point-unit-price/price-point-unit-price.component';
import { PricePointUnitComponent } from '../product-price-points/price-points/price-point/price-point-unit/price-point-unit.component';
import { PricePointStrikethroughPriceComponent } from '../product-price-points/price-points/price-point/price-point-strikethrough-price/price-point-strikethrough-price.component';
import { PricePointPriceComponent } from '../product-price-points/price-points/price-point/price-point-price/price-point-price.component';
import { PricePointShippingComponent } from '../product-price-points/price-points/price-point/price-point-shipping/price-point-shipping.component';
import { PricePointRecurringPaymentComponent } from '../product-price-points/price-points/price-point/price-point-recurring-payment/price-point-recurring-payment.component';



@NgModule({
  declarations: [
    ProductFormComponent,
    ProductMediaListComponent,
    ProductMediaDisplayComponent,
    ProductNameComponent,
    ProductPriceComponent,
    ProductShippingComponent,
    ProductRecurringPaymentComponent,
    ProductHoplinkComponent,
    ProductDescriptionComponent,
    DescriptionComponent,
    TextToolbarPopupComponent,
    ProductPricePointsComponent,
    PricePointsComponent,
    PricePointHeaderComponent,
    PricePointQuantityComponent,
    PricePointImageComponent,
    PricePointUnitPriceComponent,
    PricePointUnitComponent,
    PricePointStrikethroughPriceComponent,
    PricePointPriceComponent,
    PricePointShippingComponent,
    PricePointRecurringPaymentComponent,
    SubproductsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ColorSwatchModule,
    RecurringPaymentModule,
    ShippingModule,
    IconButtonModule,
    DropdownModule
  ],
  exports: [
    ProductFormComponent
  ]
})
export class ProductFormModule { }
