import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiColumnListComponent } from './multi-column-list.component';
import { MultiColumnItemModule } from '../../items/multi-column-item/multi-column-item.module';



@NgModule({
  declarations: [MultiColumnListComponent],
  imports: [
    CommonModule,
    MultiColumnItemModule
  ],
  exports: [MultiColumnListComponent]
})
export class MultiColumnListModule { }
