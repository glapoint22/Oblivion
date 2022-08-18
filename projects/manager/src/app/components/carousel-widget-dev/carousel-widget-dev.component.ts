import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { CarouselBanner, CarouselWidgetComponent } from 'widgets';
import { BuilderType, MediaLocation, WidgetInspectorView } from '../../classes/enums';
import { MediaReference } from '../../classes/media-reference';
import { UpdatedMediaReferenceId } from '../../classes/updated-media-reference-id';
import { WidgetService } from '../../services/widget/widget.service';

@Component({
  selector: 'carousel-widget-dev',
  templateUrl: './carousel-widget-dev.component.html',
  styleUrls: ['./carousel-widget-dev.component.scss']
})
export class CarouselWidgetDevComponent extends CarouselWidgetComponent {
  public currentBannerIndex: number = 0;
  public widgetInspectorView = WidgetInspectorView;

  constructor(public widgetService: WidgetService) { super() }

  // ------------------------------------------------------------------------ Get Image Reference --------------------------------------------------
  public getMediaReference(banner: CarouselBanner) {
    return {
      mediaId: banner.image.id,
      imageSizeType: banner.image.imageSizeType,
      builder: BuilderType.Page,
      hostId: this.widgetService.page.id,
      location: MediaLocation.CarouselWidgetBanner
    }
  }

  // -------------------------------------------------------------------------- Get Reference Ids --------------------------------------------------
  public getReferenceIds(update?: boolean): Array<number> {
    const referenceIds: Array<number> = new Array<number>();

    this.banners.forEach((banner: CarouselBanner) => {
      if (banner.image && banner.image.src) {
        referenceIds.push(banner.image.referenceId);

        if (update) {
          const subscription: Subscription = this.widgetService.$mediaReferenceUpdate
            .subscribe((updatedMediaReferenceIds: Array<UpdatedMediaReferenceId>) => {
              const referenceId = updatedMediaReferenceIds.find(x => x.oldId == banner.image.referenceId)?.newId;
              banner.image.referenceId = referenceId!;
              subscription.unsubscribe();
            });
        }
      }
    });

    return referenceIds;
  }
}