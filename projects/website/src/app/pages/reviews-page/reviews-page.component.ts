import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountService, LazyLoadingService, SpinnerAction } from 'common';
import { Subscription } from 'rxjs';
import { DetailProduct } from '../../classes/detail-product';
import { WriteReviewFormComponent } from '../../components/write-review-form/write-review-form.component';
import { Breadcrumb } from '../../classes/breadcrumb';

@Component({
  selector: 'reviews-page',
  templateUrl: './reviews-page.component.html',
  styleUrls: ['./reviews-page.component.scss']
})
export class ReviewsPageComponent implements OnInit {
  public product!: DetailProduct;
  public breadcrumbs!: Array<Breadcrumb>;

  constructor
    (
      private route: ActivatedRoute,
      private accountService: AccountService,
      public lazyLoadingService: LazyLoadingService
    ) { }

  ngOnInit(): void {
    this.product = this.route.snapshot.parent?.data.product;

    // Set the breadcrumbs
    this.breadcrumbs = [
      {
        link: {
          name: this.product.breadcrumb[0].name,
          route: '/browse',
          queryParams: { nicheName: this.product.breadcrumb[0].urlName, nicheId: this.product.breadcrumb[0].id }
        }
      },
      {
        link: {
          name: this.product.breadcrumb[1].name,
          route: '/browse',
          queryParams: { subnicheName: this.product.breadcrumb[1].urlName, subnicheId: this.product.breadcrumb[1].id }
        }
      },
      {
        link: {
          name: this.product.name,
          route: '/' + this.product.urlName + '/' + this.product.id
        }
      },
      {
        active: 'Reviews'
      }
    ]
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
        const accountServiceOnRedirectSubscription: Subscription = this.accountService.onRedirect.subscribe(() => {
          this.onWriteReviewClick();
          accountServiceOnRedirectSubscription.unsubscribe();
        });
      });
  }
}