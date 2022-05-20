import { Component, Input } from '@angular/core';
import { Image, LazyLoadingService, MediaType, SpinnerAction } from 'common';
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

        if (editMode) {
          mediaBrowser.editedImage = this.image;
        }


        mediaBrowser.callback = (image: Image) => {
          if (image) {
            this.image.id = image.id;
            this.image.name = image.name;
            this.image.src = image.src;
            this.image.thumbnail = image.thumbnail;
          }
        }
      });
  }
}