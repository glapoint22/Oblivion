import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list.component';
import { ItemComponent } from '../items/item/item.component';



@NgModule({
  declarations: [ListComponent, ItemComponent],
  imports: [
    CommonModule
  ],
  exports: [
    ListComponent
  ]
})
export class ListModule { }
