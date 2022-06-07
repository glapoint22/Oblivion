import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectedKeywordsComponent } from './selected-keywords.component';
import { IconButtonModule } from '../icon-button/icon-button.module';
import { CheckboxHierarchyModule } from '../hierarchies/checkbox-hierarchy/checkbox-hierarchy.module';
import { CheckboxMultiColumnListModule } from '../lists/checkbox-multi-column-list/checkbox-multi-column-list.module';



@NgModule({
  declarations: [SelectedKeywordsComponent],
  imports: [
    CommonModule,
    IconButtonModule,
    CheckboxHierarchyModule,
    CheckboxMultiColumnListModule
  ],
  exports: [
    SelectedKeywordsComponent
  ]
})
export class SelectedKeywordsModule { }
