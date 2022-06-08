import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormKeywordsComponent } from './form-keywords.component';
import { IconButtonModule } from '../icon-button/icon-button.module';
import { HierarchyModule } from '../hierarchies/hierarchy/hierarchy.module';
import { MultiColumnListModule } from '../lists/multi-column-list/multi-column-list.module';



@NgModule({
  declarations: [FormKeywordsComponent],
  imports: [
    CommonModule,
    IconButtonModule,
    HierarchyModule,
    MultiColumnListModule
  ],
  exports: [
    FormKeywordsComponent
  ]
})
export class FormKeywordsModule { }
