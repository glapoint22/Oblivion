import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductGroupWidgetComponent } from './product-group-widget.component';



@NgModule({
  declarations: [ProductGroupWidgetComponent],
  imports: [
    CommonModule
  ],
  exports: [ProductGroupWidgetComponent]
})
export class ProductGroupWidgetModule { }
