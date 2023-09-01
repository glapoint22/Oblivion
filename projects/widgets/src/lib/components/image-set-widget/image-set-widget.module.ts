import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageSetWidgetComponent } from './image-set-widget.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    ImageSetWidgetComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    ImageSetWidgetComponent
  ]
})
export class ImageSetWidgetModule { }
