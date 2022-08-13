import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DataService, Image, ImageSizeType, LazyLoadingService, MediaType, SpinnerAction } from 'common';
import { ImageReference } from '../../classes/image-reference';
import { MediaBrowserComponent } from '../media-browser/media-browser.component';

@Component({
  selector: 'image-box',
  templateUrl: './image-box.component.html',
  styleUrls: ['./image-box.component.scss']
})
export class ImageBoxComponent {
  @Input() image!: Image;
  @Input() showRemoveImage!: boolean;
  @Input() imageReference!: ImageReference;
  @Output() onChange: EventEmitter<void> = new EventEmitter();


  constructor(private lazyLoadingService: LazyLoadingService, private dataService: DataService) { }


  public openMediaBrowser(): void {
    this.lazyLoadingService.load(async () => {
      const { MediaBrowserComponent } = await import('../media-browser/media-browser.component');
      const { MediaBrowserModule } = await import('../media-browser/media-browser.module');
      return {
        component: MediaBrowserComponent,
        module: MediaBrowserModule
      }
    }, SpinnerAction.None)
      .then((mediaBrowser: MediaBrowserComponent) => {
        // Initialize the media browser
        mediaBrowser.init(MediaType.Image, ImageSizeType.AnySize, this.image, this.imageReference);

        mediaBrowser.callback = (image: Image) => {
          if (image) {
            this.image.id = image.id;
            this.image.name = image.name;
            this.image.src = image.src;
            this.image.thumbnail = image.thumbnail;
            this.image.imageSizeType = image.imageSizeType;
            this.onChange.emit();
          }
        }
      });
  }


  removeImage() {
    this.imageReference.imageId = this.image.id;
    this.imageReference.imageSizeType = this.image.imageSizeType;
    this.dataService.post('api/Media/ImageReferences/Remove', [this.imageReference]).subscribe();
    this.image.src = null!;
    this.image.id = null!;
    this.image.thumbnail = null!;
    this.image.name = null!;
    this.onChange.emit();
  }
}