import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Image, ImageSizeType, LazyLoadingService, MediaType, SpinnerAction } from 'common';
import { MediaBrowserComponent } from '../media-browser/media-browser.component';

@Component({
  selector: 'image-box',
  templateUrl: './image-box.component.html',
  styleUrls: ['./image-box.component.scss']
})
export class ImageBoxComponent {
  @Input() image!: Image;
  @Input() showRemoveImage!: boolean;
  @Output() onChange: EventEmitter<void> = new EventEmitter();

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
      // .then((mediaBrowser: MediaBrowserComponent) => {
      //   mediaBrowser.currentMediaType = MediaType.Image;
      //   mediaBrowser.imageSizeType = ImageSizeType.AnySize;

      //   if (editMode) {
      //     mediaBrowser.editedImage = this.image;
      //   }


      //   mediaBrowser.callback = (image: Image) => {
      //     if (image) {
      //       this.image.id = image.id;
      //       this.image.name = image.name;
      //       this.image.src = image.src;
      //       this.image.thumbnail = image.thumbnail;
      //       this.onChange.emit();
      //     }
      //   }
      // });
  }


  removeImage() {
    this.image.src = null!;
    this.image.id = null!;
    this.image.thumbnail = null!;
    this.image.name = null!;
    this.onChange.emit();
  }
}