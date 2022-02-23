import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageBoxComponent } from './image-box.component';



@NgModule({
  declarations: [ImageBoxComponent],
  imports: [
    CommonModule
  ],
  exports: [ImageBoxComponent]
})
export class ImageBoxModule { }
