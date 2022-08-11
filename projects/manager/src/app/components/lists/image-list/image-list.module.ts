import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageListComponent } from './image-list.component';
import { ImageItemModule } from '../../items/image-item/image-item.module';



@NgModule({
  declarations: [ImageListComponent],
  imports: [
    CommonModule,
    ImageItemModule
  ],
  exports: [ImageListComponent]
})
export class ImageListModule { }
