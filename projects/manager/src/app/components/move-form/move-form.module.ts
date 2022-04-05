import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoveFormComponent } from './move-form.component';
import { ListModule } from '../lists/list/list.module';



@NgModule({
  declarations: [MoveFormComponent],
  imports: [
    CommonModule,
    ListModule
  ]
})
export class MoveFormModule { }
