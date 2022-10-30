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
    ProductPricePointsComponent,
    PricePointsComponent,
    TextToolbarPopupComponent,
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
