import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageInfoComponent } from './image-info.component';
import { MultiColumnListModule } from '../lists/multi-column-list/multi-column-list.module';



@NgModule({
  declarations: [ImageInfoComponent],
  imports: [
    CommonModule,
    MultiColumnListModule
  ],
  exports: [ImageInfoComponent]
})
export class ImageInfoModule { }
