import { Component, Input, OnChanges } from '@angular/core';
import { LazyLoadingService, Media, MediaType, ShippingType, SpinnerAction } from 'common';
import { Subscription } from 'rxjs';
import { TextBox, TextBoxData } from 'text-box';
import { DetailProduct } from '../../classes/detail-product';
import { AddToListFormComponent } from '../../components/add-to-list-form/add-to-list-form.component';
import { MediaPlayerComponent } from '../../components/media-player/media-player.component';
import { ReportItemFormComponent } from '../../components/report-item-form/report-item-form.component';
import { AccountService } from '../../services/account/account.service';
import { SocialMediaService } from '../../services/social-media/social-media.service';

@Component({
  selector: 'product-info',
  templateUrl: './product-info.component.html',
  styleUrls: ['./product-info.component.scss']
})
export class ProductInfoComponent implements OnChanges {
  @Input() product!: DetailProduct;
  @Input() clientWidth!: number;
  public selectedMedia!: Media;
  public mediaType = MediaType;
  public shippingType = ShippingType;

  constructor
    (
      private lazyLoadingService: LazyLoadingService,
      private accountService: AccountService,
      public socialMediaService: SocialMediaService
    ) { }


  ngOnChanges() {
    this.selectedMedia = this.product.media[0];
  }




  getDescription(rootElement: HTMLElement) {
    const textBoxData: Array<TextBoxData> = JSON.parse(this.product.description);
    const textBox = new TextBox(rootElement);
    
    textBox.load(textBoxData);
    textBox.render();
  }


  onVisitOfficialWebsiteClick() {
    // Navigate to the product page
    window.open(this.product.hoplink, '_blank');
  }


  async onAddToListClick() {
    if (this.accountService.user) {
      this.lazyLoadingService.load(async () => {
        const { AddToListFormComponent } = await import('../../components/add-to-list-form/add-to-list-form.component');
        const { AddToListFormModule } = await import('../../components/add-to-list-form/add-to-list-form.module');

        return {
          component: AddToListFormComponent,
          module: AddToListFormModule
        }
      }, SpinnerAction.Start)
        .then((addToListForm: AddToListFormComponent) => {
          addToListForm.product = this.product;
          addToListForm.productImage = this.product.media[0].imageMd;
        });

    } else {
      this.logIn(true);
    }
  }




  async onReportItemClick() {
    if (this.accountService.user) {
      this.lazyLoadingService.load(async () => {
        const { ReportItemFormComponent } = await import('../../components/report-item-form/report-item-form.component');
        const { ReportItemFormModule } = await import('../../components/report-item-form/report-item-form.module');

        return {
          component: ReportItemFormComponent,
          module: ReportItemFormModule
        }
      }, SpinnerAction.StartEnd)
        .then((reportItemForm: ReportItemFormComponent) => reportItemForm.productId = this.product.id);
    } else {
      this.logIn(false);
    }
  }



  async onMediaClick(media: Media) {
    if (media.type != MediaType.Video) return;

    this.lazyLoadingService.load(async () => {
      const { MediaPlayerComponent } = await import('../../components/media-player/media-player.component');
      const { MediaPlayerModule } = await import('../../components/media-player/media-player.module');

      return {
        component: MediaPlayerComponent,
        module: MediaPlayerModule
      }
    }, SpinnerAction.StartEnd)
      .then((mediaPlayer: MediaPlayerComponent) => {
        mediaPlayer.media = this.product.media;
        mediaPlayer.selectedVideo = this.selectedMedia;
        mediaPlayer.selectedImage = this.product.media[0];
      });
  }




  async logIn(isAddToList: boolean) {
    this.lazyLoadingService.load(async () => {
      const { LogInFormComponent } = await import('../log-in-form/log-in-form.component');
      const { LogInFormModule } = await import('../log-in-form/log-in-form.module');

      return {
        component: LogInFormComponent,
        module: LogInFormModule
      }
    }, SpinnerAction.StartEnd)
      .then(() => {
        const subscription: Subscription = this.accountService.onRedirect.subscribe(() => {
          if (isAddToList) {
            this.onAddToListClick();
          } else {
            this.onReportItemClick();
          }

          subscription.unsubscribe();
        });
      });
  }
}