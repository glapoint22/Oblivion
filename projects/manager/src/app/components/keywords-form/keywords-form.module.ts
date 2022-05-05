import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeywordsFormComponent } from './keywords-form.component';
import { IconButtonModule } from '../icon-button/icon-button.module';
import { HierarchyModule } from '../hierarchies/hierarchy/hierarchy.module';
import { MultiColumnListModule } from '../lists/multi-column-list/multi-column-list.module';



@NgModule({
  declarations: [KeywordsFormComponent],
  imports: [
    CommonModule,
    IconButtonModule,
    HierarchyModule,
    MultiColumnListModule
  ],
  exports: [
    KeywordsFormComponent
  ]
})
export class KeywordsFormModule { }