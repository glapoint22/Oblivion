import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageBoxComponent } from './image-box.component';
import { IconButtonModule } from '../icon-button/icon-button.module';



@NgModule({
  declarations: [ImageBoxComponent],
  imports: [
    CommonModule,
    IconButtonModule
  ],
  exports: [ImageBoxComponent]
})
export class ImageBoxModule { }
