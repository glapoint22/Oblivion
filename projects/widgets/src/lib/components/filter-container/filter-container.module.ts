import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterContainerComponent } from './filter-container.component';



@NgModule({
  declarations: [FilterContainerComponent],
  imports: [
    CommonModule
  ],
  exports: [
    FilterContainerComponent
  ]
})
export class FilterContainerModule { }
