import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaPlayerComponent } from './media-player.component';
import { MediaFilterPipe } from '../../pipes/media-filter/media-filter.pipe';



@NgModule({
  declarations: [
    MediaPlayerComponent,
    MediaFilterPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [MediaPlayerComponent]
})
export class MediaPlayerModule { }
