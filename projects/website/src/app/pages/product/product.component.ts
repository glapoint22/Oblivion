import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LazyLoadingService, SpinnerAction } from 'common';
import { Subscription } from 'rxjs';
import { DetailProduct } from '../../classes/detail-product';
import { WriteReviewFormComponent } from '../../components/write-review-form/write-review-form.component';
import { AccountService } from '../../services/account/account.service';
import { SocialMediaService } from '../../services/social-media/social-media.service';

@Component({
  selector: 'product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  public product!: DetailProduct;
  public clientWidth!: number;

  constructor
    (
      private route: ActivatedRoute,
      private lazyLoadingService: LazyLoadingService,
      private accountService: AccountService,
      private socialMediaService: SocialMediaService
    ) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.product = data.product;
      this.socialMediaService.addMetaTags(this.product.name, this.product.description, this.product.media[0].src);
    });

    this.onWindowResize();
  }

  onVisitOfficialWebsiteClick() {
    // Navigate to the product page
    window.open(this.product.hoplink, '_blank');
  }




  async onWriteReviewClick() {
    if (this.accountService.user) {
      this.lazyLoadingService.load(async () => {
        const { WriteReviewFormComponent } = await import('../../components/write-review-form/write-review-form.component');
        const { WriteReviewFormModule } = await import('../../components/write-review-form/write-review-form.module');

        return {
          component: WriteReviewFormComponent,
          module: WriteReviewFormModule
        }
      }, SpinnerAction.StartEnd)
        .then((writeReviewForm: WriteReviewFormComponent) => {
          writeReviewForm.productId = this.product.id;
          writeReviewForm.productImage = this.product.media[0].imageMd;
          writeReviewForm.productName = this.product.name;
        });
    } else {
      this.logIn();
    }
  }


  async logIn() {
    this.lazyLoadingService.load(async () => {
      const { LogInFormComponent } = await import('../../components/log-in-form/log-in-form.component');
      const { LogInFormModule } = await import('../../components/log-in-form/log-in-form.module');

      return {
        component: LogInFormComponent,
        module: LogInFormModule
      }
    }, SpinnerAction.StartEnd)
      .then(() => {
        const subscription: Subscription = this.accountService.onRedirect.subscribe(() => {
          this.onWriteReviewClick();
          subscription.unsubscribe();
        });
      });
  }


  @HostListener('window:resize')
  onWindowResize() {
    this.clientWidth = document.documentElement.clientWidth;
  }
}