import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { VideoWidgetComponent } from 'widgets';
import { BuilderType, MediaLocation, WidgetHandle, WidgetInspectorView } from '../../classes/enums';
import { MediaReference } from '../../classes/media-reference';
import { UpdatedMediaReferenceId } from '../../classes/updated-media-reference-id';
import { WidgetService } from '../../services/widget/widget.service';

@Component({
  selector: 'video-widget-dev',
  templateUrl: './video-widget-dev.component.html',
  styleUrls: ['./video-widget-dev.component.scss']
})
export class VideoWidgetDevComponent extends VideoWidgetComponent {
  public widgetHandle = WidgetHandle;
  public widgetInspectorView = WidgetInspectorView;

  constructor(public widgetService: WidgetService) { super() }


  ngAfterViewChecked() {
    if (this.video && this.video.src && this.iframe.nativeElement.src != this.video.src) {
      this.iframe.nativeElement.src = this.video.src;
    }
  }

  // ------------------------------------------------------------------------ Get Media Reference --------------------------------------------------
  public getMediaReference() {
    return {
      mediaId: this.video.id,
      imageSizeType: 0,
      builder: BuilderType.Page,
      hostId: this.widgetService.page.id,
      location: MediaLocation.VideoWidget
    }
  }



  // -------------------------------------------------------------------------- Get Reference Ids --------------------------------------------------
  public getReferenceIds(update?: boolean): Array<number> {
    let referenceIds: Array<number> = new Array<number>();

    referenceIds.push(this.video.referenceId);

    if (update) {
      const subscription: Subscription = this.widgetService.$mediaReferenceUpdate
        .subscribe((updatedMediaReferenceIds: Array<UpdatedMediaReferenceId>) => {
          const referenceId = updatedMediaReferenceIds.find(x => x.oldId == this.video.referenceId)?.newId;
          this.video.referenceId = referenceId!;
          subscription.unsubscribe();
        });
    }
    return referenceIds;
  }
}