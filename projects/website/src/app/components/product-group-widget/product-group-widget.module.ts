import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductGroupWidgetComponent } from './product-group-widget.component';
import { ProductThumbnailModule } from '../product-thumbnail/product-thumbnail.module';



@NgModule({
  declarations: [ProductGroupWidgetComponent],
  imports: [
    CommonModule,
    ProductThumbnailModule
  ],
  exports: [ProductGroupWidgetComponent]
})
export class ProductGroupWidgetModule { }
