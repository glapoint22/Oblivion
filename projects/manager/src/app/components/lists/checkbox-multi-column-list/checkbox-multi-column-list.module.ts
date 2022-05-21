import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxMultiColumnListComponent } from './checkbox-multi-column-list.component';
import { CheckboxMultiColumnItemModule } from '../../items/checkbox-multi-column-item/checkbox-multi-column-item.module';
import { MultiColumnItemModule } from '../../items/multi-column-item/multi-column-item.module';


@NgModule({
  declarations: [CheckboxMultiColumnListComponent],
  imports: [
    CommonModule,
    CheckboxMultiColumnItemModule,
    MultiColumnItemModule
  ],
  exports: [CheckboxMultiColumnListComponent]
})
export class CheckboxMultiColumnListModule { }