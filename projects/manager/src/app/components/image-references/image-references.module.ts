import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageReferencesComponent } from './image-references.component';
import { MultiColumnListModule } from '../lists/multi-column-list/multi-column-list.module';



@NgModule({
  declarations: [ImageReferencesComponent],
  imports: [
    CommonModule,
    MultiColumnListModule
  ],
  exports: [ImageReferencesComponent]
})
export class ImageReferencesModule { }
