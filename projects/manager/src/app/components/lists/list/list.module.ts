import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list.component';
import { ItemModule } from '../../items/item/item.module';



@NgModule({
  declarations: [ListComponent],
  imports: [
    CommonModule,
    ItemModule
  ],
  exports: [
    ListComponent
  ]
})
export class ListModule { }