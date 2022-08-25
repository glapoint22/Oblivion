import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductPropertiesComponent } from './product-properties.component';
import { PricePointsComponent } from '../price-points/price-points.component';
import { ProductDescriptionComponent } from '../product-description/product-description.component';
import { TextToolbarPopupComponent } from '../text-toolbar-popup/text-toolbar-popup.component';
import { FormsModule } from '@angular/forms';
import { ColorSwatchModule } from '../color-swatch/color-swatch.module';
import { RecurringPaymentModule, ShippingModule } from 'common';
import { SubproductsComponent } from '../subproducts/subproducts.component';
import { IconButtonModule } from '../icon-button/icon-button.module';
import { DropdownModule } from '../dropdown/dropdown.module';



@NgModule({
  declarations: [
    ProductPropertiesComponent,
    PricePointsComponent,
    ProductDescriptionComponent,
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
  exports:[
    ProductPropertiesComponent
  ]
})
export class ProductPropertiesModule { }
