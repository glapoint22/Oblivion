import { Pipe, PipeTransform } from '@angular/core';
import { Media, MediaType } from 'common';

@Pipe({
  name: 'mediaFilter'
})
export class MediaFilterPipe implements PipeTransform {

  transform(mediaItems: Array<Media>, isVideos: boolean): Array<Media> {
    return mediaItems.filter((media: Media) => isVideos ? media.type == MediaType.Video : media.type == MediaType.Image);
  }
}