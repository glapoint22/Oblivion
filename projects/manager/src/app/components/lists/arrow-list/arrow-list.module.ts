import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArrowListComponent } from './arrow-list.component';
import { ArrowItemModule } from '../../items/arrow-item/arrow-item.module';



@NgModule({
  declarations: [ArrowListComponent],
  imports: [
    CommonModule,
    ArrowItemModule
  ],
  exports: [ArrowListComponent]
})
export class ArrowListModule { }
