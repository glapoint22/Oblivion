import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltersFormComponent } from './filters-form.component';
import { FormFiltersModule } from '../form-filters/form-filters.module';



@NgModule({
  declarations: [FiltersFormComponent],
  imports: [
    CommonModule,
    FormFiltersModule
  ]
})
export class FiltersFormModule { }
