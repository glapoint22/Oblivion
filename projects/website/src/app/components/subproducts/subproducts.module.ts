import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubproductsComponent } from './subproducts.component';



@NgModule({
  declarations: [SubproductsComponent],
  imports: [
    CommonModule
  ],
  exports: [SubproductsComponent]
})
export class SubproductsModule { }
