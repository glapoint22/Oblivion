import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductPropertiesComponent } from './product-properties.component';
import { PricePointsComponent } from '../price-points/price-points.component';



@NgModule({
  declarations: [
    ProductPropertiesComponent,
    PricePointsComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[
    ProductPropertiesComponent
  ]
})
export class ProductPropertiesModule { }
