import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportItemFormComponent } from './report-item-form.component';
import { DropdownModule } from '../dropdown/dropdown.module';



@NgModule({
  declarations: [ReportItemFormComponent],
  imports: [
    CommonModule,
    DropdownModule
  ]
})
export class ReportItemFormModule { }
