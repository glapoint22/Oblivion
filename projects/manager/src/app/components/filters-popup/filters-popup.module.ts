import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltersPopupComponent } from './filters-popup.component';
import { ProductFiltersModule } from '../product-filters/product-filters.module';



@NgModule({
  declarations: [FiltersPopupComponent],
  imports: [
    CommonModule,
    ProductFiltersModule
  ],
  exports: [FiltersPopupComponent]
})
export class FiltersPopupModule { }
