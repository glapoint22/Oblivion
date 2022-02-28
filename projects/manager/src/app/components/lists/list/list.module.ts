import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemComponent } from '../../items/item/item.component';
import { ListComponent } from './list.component';



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