import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArrowListComponent } from './arrow-list.component';
import { ArrowItemComponent } from '../../items/arrow-item/arrow-item.component';



@NgModule({
  declarations: [ArrowListComponent, ArrowItemComponent],
  imports: [
    CommonModule
  ],
  exports: [ArrowListComponent]
})
export class ArrowListModule { }
