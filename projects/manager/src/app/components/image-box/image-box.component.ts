import { Component, Input } from '@angular/core';
import { Image, LazyLoadingService, Media, MediaType, SpinnerAction } from 'common';
import { MediaBrowserComponent } from '../media-browser/media-browser.component';

@Component({
  selector: 'image-box',
  templateUrl: './image-box.component.html',
  styleUrls: ['./image-box.component.scss']
})
export class ImageBoxComponent {
  @Input() image!: Image;
  @Input() showRemoveImage!: boolean;

  constructor(private lazyLoadingService: LazyLoadingService) { }


  public openMediaBrowser(editMode?: boolean): void {
    this.lazyLoadingService.load(async () => {
      const { MediaBrowserComponent } = await import('../media-browser/media-browser.component');
      const { MediaBrowserModule } = await import('../media-browser/media-browser.module');
      return {
        component: MediaBrowserComponent,
        module: MediaBrowserModule
      }
    }, SpinnerAction.None)
      .then((mediaBrowser: MediaBrowserComponent) => {
        mediaBrowser.currentMediaType = MediaType.Image;

        if(editMode) {
          mediaBrowser.editedImage = this.image;
        }
        

        mediaBrowser.callback = (media: Media) => {
          this.image.id = media.id;
          this.image.name = media.name;
          this.image.src = media.image;
        }
      });
  }
}