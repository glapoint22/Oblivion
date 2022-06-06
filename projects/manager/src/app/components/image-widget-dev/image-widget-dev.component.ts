import { Component } from '@angular/core';
import { Image, LazyLoadingService, MediaType, SpinnerAction } from 'common';
import { ImageWidgetComponent, ImageWidgetData } from 'widgets';
import { WidgetHandle } from '../../classes/enums';
import { WidgetService } from '../../services/widget/widget.service';
import { MediaBrowserComponent } from '../media-browser/media-browser.component';

@Component({
  selector: 'image-widget-dev',
  templateUrl: './image-widget-dev.component.html',
  styleUrls: ['./image-widget-dev.component.scss']
})
export class ImageWidgetDevComponent extends ImageWidgetComponent {
  public widgetHandle = WidgetHandle;

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

          mediaBrowser.callback = (image: Image) => {
            if (image) {
              imageWidgetData.image = image;
              super.setWidget(imageWidgetData);
              this.widgetService.page.save();
            } else {
              this.widgetService.selectedColumn.deleteColumn();
            }
          }
        });
    }
  }


  public onImageLoad(event: Event) {
    const image = event.target as HTMLImageElement;

    if (!this.width || this.width != image.naturalWidth) this.width = image.naturalWidth;
    window.setTimeout(() => {
      this.widgetService.onRowChange(this.widgetService.selectedRow.containerComponent);
    });
  }
}