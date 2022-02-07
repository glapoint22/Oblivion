import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { MediaType } from '../../classes/enums';
import { Media } from '../../classes/media';
import { Product } from '../../classes/product';
import { AddToListFormComponent } from '../../components/add-to-list-form/add-to-list-form.component';
import { MediaPlayerComponent } from '../../components/media-player/media-player.component';
import { ReportItemFormComponent } from '../../components/report-item-form/report-item-form.component';
import { AccountService } from '../../services/account/account.service';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';
import { SocialMediaService } from '../../services/social-media/social-media.service';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { LogInFormComponent } from '../log-in-form/log-in-form.component';

@Component({
  selector: 'product-info',
  templateUrl: './product-info.component.html',
  styleUrls: ['./product-info.component.scss']
})
export class ProductInfoComponent implements OnChanges {
  @Input() product!: Product;
  @Input() clientWidth!: number;
  public selectedMedia!: Media;
  public mediaType = MediaType;

  constructor
    (
      private lazyLoadingService: LazyLoadingService,
      private accountService: AccountService,
      private spinnerService: SpinnerService,
      public socialMediaService: SocialMediaService
    ) { }


  ngOnChanges() {
    this.selectedMedia = this.product.media[0];
  }


  onVisitOfficialWebsiteClick() {
    // Navigate to the product page
    window.open(this.product.hoplink, '_blank');
  }


  async onAddToListClick(logInForm: LogInFormComponent | null) {
    if (this.accountService.customer) {
      this.spinnerService.show = true;
      const { AddToListFormComponent } = await import('../../components/add-to-list-form/add-to-list-form.component');
      const { AddToListFormModule } = await import('../../components/add-to-list-form/add-to-list-form.module');

      this.lazyLoadingService.getComponentAsync(AddToListFormComponent, AddToListFormModule, this.lazyLoadingService.container)
        .then((addToListForm: AddToListFormComponent) => {
          addToListForm.product = this.product;
          addToListForm.logInForm = logInForm;
        });
    } else {
      this.logIn(true);
    }
  }




  async onReportItemClick(logInForm: LogInFormComponent | null) {
    if (this.accountService.customer) {
      this.spinnerService.show = true;
      const { ReportItemFormComponent } = await import('../../components/report-item-form/report-item-form.component');
      const { ReportItemFormModule } = await import('../../components/report-item-form/report-item-form.module');

      this.lazyLoadingService.getComponentAsync(ReportItemFormComponent, ReportItemFormModule, this.lazyLoadingService.container)
        .then((reportItemForm: ReportItemFormComponent) => {
          reportItemForm.productId = this.product.id;
          reportItemForm.logInForm = logInForm;
          this.spinnerService.show = false;
        });
    } else {
      this.logIn(false);
    }
  }



  async onMediaClick(media: Media) {
    if (media.type != MediaType.Video) return;

    this.spinnerService.show = true;
    const { MediaPlayerComponent } = await import('../../components/media-player/media-player.component');
    const { MediaPlayerModule } = await import('../../components/media-player/media-player.module');

    this.lazyLoadingService.getComponentAsync(MediaPlayerComponent, MediaPlayerModule, this.lazyLoadingService.container)
      .then((mediaPlayer: MediaPlayerComponent) => {
        mediaPlayer.media = this.product.media;
        mediaPlayer.selectedVideo = this.selectedMedia;
        mediaPlayer.selectedImage = this.product.media[0];
        this.spinnerService.show = false;
      });
  }




  async logIn(isAddToList: boolean) {
    this.spinnerService.show = true;
    const { LogInFormComponent } = await import('../log-in-form/log-in-form.component');
    const { LogInFormModule } = await import('../log-in-form/log-in-form.module')


    this.lazyLoadingService.getComponentAsync(LogInFormComponent, LogInFormModule, this.lazyLoadingService.container)
      .then((logInForm: LogInFormComponent) => {
        const subscription: Subscription = this.accountService.onRedirect.subscribe(() => {
          if (isAddToList) {
            this.onAddToListClick(logInForm);
          } else {
            this.onReportItemClick(logInForm);
          }

          subscription.unsubscribe();
        });
        this.spinnerService.show = false;
      });
  }
}