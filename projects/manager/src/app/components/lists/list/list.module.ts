import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list.component';
import { ListItemModule } from '../../items/list-item/list-item.module';



@NgModule({
  declarations: [ListComponent],
  imports: [
    CommonModule,
    ListItemModule
  ],
  exports: [
    ListComponent
  ]
})
export class ListModule { }