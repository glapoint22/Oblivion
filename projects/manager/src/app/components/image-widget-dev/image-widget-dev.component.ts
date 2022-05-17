import { Component } from '@angular/core';
import { Image, LazyLoadingService, Media, MediaType, SpinnerAction } from 'common';
import { ImageWidgetComponent, ImageWidgetData } from 'widgets';
import { WidgetService } from '../../services/widget/widget.service';
import { MediaBrowserComponent } from '../media-browser/media-browser.component';

@Component({
  selector: 'image-widget-dev',
  templateUrl: './image-widget-dev.component.html',
  styleUrls: ['./image-widget-dev.component.scss']
})
export class ImageWidgetDevComponent extends ImageWidgetComponent {

  constructor(public widgetService: WidgetService, private lazyLoadingService: LazyLoadingService) { super() }

  setWidget(imageWidgetData: ImageWidgetData): void {
    if (imageWidgetData && imageWidgetData.image && imageWidgetData.image.src) {
      super.setWidget(imageWidgetData);
    } else {
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
          mediaBrowser.callback = (media: Media) => {
            const image = new Image();

            image.id = media.id;
            image.name = media.name;
            image.src = media.image;
            imageWidgetData.image = image;
            super.setWidget(imageWidgetData);
          }
        });
    }
  }


  public onImageLoad(event: Event) {
    const image = event.target as HTMLImageElement;

    if (!this.width) this.width = image.naturalWidth;
  }
}