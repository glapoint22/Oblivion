import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductPropertiesComponent } from './product-properties.component';
import { PricePointsComponent } from '../price-points/price-points.component';
import { ProductDescriptionComponent } from '../product-description/product-description.component';
import { TextToolbarPopupComponent } from '../text-toolbar-popup/text-toolbar-popup.component';
import { FormsModule } from '@angular/forms';
import { ColorSwatchModule } from '../color-swatch/color-swatch.module';



@NgModule({
  declarations: [
    ProductPropertiesComponent,
    PricePointsComponent,
    ProductDescriptionComponent,
    TextToolbarPopupComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ColorSwatchModule
  ],
  exports:[
    ProductPropertiesComponent
  ]
})
export class ProductPropertiesModule { }
