import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiColumnItemComponent } from './multi-column-item.component';



@NgModule({
  declarations: [MultiColumnItemComponent],
  imports: [
    CommonModule
  ],
  exports: [MultiColumnItemComponent]
})
export class MultiColumnItemModule { }
