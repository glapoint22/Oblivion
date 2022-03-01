import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArrowItemComponent } from './arrow-item.component';



@NgModule({
  declarations: [ArrowItemComponent],
  imports: [
    CommonModule
  ],
  exports: [ArrowItemComponent]
})
export class ArrowItemModule { }
