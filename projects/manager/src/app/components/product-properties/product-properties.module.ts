import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductPropertiesComponent } from './product-properties.component';



@NgModule({
  declarations: [ProductPropertiesComponent],
  imports: [
    CommonModule
  ],
  exports:[
    ProductPropertiesComponent
  ]
})
export class ProductPropertiesModule { }
