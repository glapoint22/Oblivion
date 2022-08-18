import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DataService, Image, ImageSizeType, LazyLoadingService, MediaType, SpinnerAction } from 'common';
import { MediaReference } from '../../classes/media-reference';
import { MediaBrowserComponent } from '../media-browser/media-browser.component';

@Component({
  selector: 'image-box',
  templateUrl: './image-box.component.html',
  styleUrls: ['./image-box.component.scss']
})
export class ImageBoxComponent {
  @Input() image!: Image;
  @Input() showRemoveImage!: boolean;
  @Input() mediaReference!: MediaReference;
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
        mediaBrowser.init(MediaType.Image, this.image, this.mediaReference, ImageSizeType.AnySize);

        mediaBrowser.callback = (image: Image) => {
          if (image) {
            this.image.id = image.id;
            this.image.name = image.name;
            this.image.src = image.src;
            this.image.thumbnail = image.thumbnail;
            this.image.imageSizeType = image.imageSizeType;
            this.image.referenceId = image.referenceId;
            this.onChange.emit();
          }
        }
      });
  }


  removeImage() {
    this.dataService.post('api/Media/MediaReferences/Remove', [this.image.referenceId]).subscribe();
    this.image.src = null!;
    this.image.id = null!;
    this.image.thumbnail = null!;
    this.image.name = null!;
    this.onChange.emit();
  }
}