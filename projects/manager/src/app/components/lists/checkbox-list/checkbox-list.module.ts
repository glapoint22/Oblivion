import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxListComponent } from './checkbox-list.component';
import { CheckboxListItemModule } from '../../items/checkbox-list-item/checkbox-list-item.module';



@NgModule({
  declarations: [CheckboxListComponent],
  imports: [
    CommonModule,
    CheckboxListItemModule
  ],
  exports: [
    CheckboxListComponent
  ]
})
export class CheckboxListModule { }
