import { Component } from '@angular/core';
import { ImageWidgetComponent } from 'widgets';
import { BuilderType, ImageLocation, WidgetHandle, WidgetInspectorView } from '../../classes/enums';
import { ImageReference } from '../../classes/image-reference';
import { WidgetService } from '../../services/widget/widget.service';

@Component({
  selector: 'image-widget-dev',
  templateUrl: './image-widget-dev.component.html',
  styleUrls: ['./image-widget-dev.component.scss']
})
export class ImageWidgetDevComponent extends ImageWidgetComponent {
  public widgetHandle = WidgetHandle;
  public widgetInspectorView = WidgetInspectorView;
  public hidden!: boolean;

  constructor(public widgetService: WidgetService) { super() }

  ngOnInit(): void {
    super.ngOnInit();

    if (this.widgetService.currentWidgetInspectorView != WidgetInspectorView.Page) {
      this.hidden = true;
    }
  }


  public onImageLoad(event: Event) {
    const image = event.target as HTMLImageElement;

    if (!this.width) this.width = image.naturalWidth;
    if (this.widgetService.currentWidgetInspectorView != WidgetInspectorView.Page) {
      window.setTimeout(() => {
        this.widgetService.onRowChange(this.widgetService.selectedRow.containerComponent);
        this.hidden = false;
      });
    }
  }



  // ------------------------------------------------------------------------ Get Image Reference --------------------------------------------------
  public getImageReference() {
    return {
      imageId: this.image.id,
      imageSizeType: this.image.imageSizeType,
      builder: BuilderType.Page,
      hostId: this.widgetService.page.id,
      location: ImageLocation.ImageWidget
    }
  }


  // ------------------------------------------------------------------------ Get Image References --------------------------------------------------
  public getImageReferences(): Array<ImageReference> {
    const imageReferences: Array<ImageReference> = new Array<ImageReference>();

    if (this.image && this.image.src) {
      imageReferences.push(this.getImageReference());
    }
    return imageReferences;
  }
}