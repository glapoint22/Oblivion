import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { ImageWidgetComponent } from 'widgets';
import { BuilderType, MediaLocation, WidgetHandle, WidgetInspectorView } from '../../classes/enums';
import { MediaReference } from '../../classes/media-reference';
import { UpdatedMediaReferenceId } from '../../classes/updated-media-reference-id';
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
  public getMediaReference() {
    return {
      mediaId: this.image.id,
      imageSizeType: this.image.imageSizeType,
      builder: BuilderType.Page,
      hostId: this.widgetService.page.id,
      location: MediaLocation.ImageWidget
    }
  }


  // -------------------------------------------------------------------------- Get Reference Ids --------------------------------------------------
  public getReferenceIds(update?: boolean): Array<number> {
    const referenceIds: Array<number> = new Array<number>();

    referenceIds.push(this.image.referenceId);

    if (update) {
      const subscription: Subscription = this.widgetService.$mediaReferenceUpdate
        .subscribe((updatedMediaReferenceIds: Array<UpdatedMediaReferenceId>) => {
          const referenceId = updatedMediaReferenceIds.find(x => x.oldId == this.image.referenceId)?.newId;
          this.image.referenceId = referenceId!;
          subscription.unsubscribe();
        });
    }

    return referenceIds;
  }
}