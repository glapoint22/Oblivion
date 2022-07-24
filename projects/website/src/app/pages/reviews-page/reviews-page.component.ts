import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LazyLoadingService, SpinnerAction } from 'common';
import { Subscription } from 'rxjs';
import { DetailProduct } from '../../classes/detail-product';
import { WriteReviewFormComponent } from '../../components/write-review-form/write-review-form.component';
import { AccountService } from '../../services/account/account.service';

@Component({
  selector: 'reviews-page',
  templateUrl: './reviews-page.component.html',
  styleUrls: ['./reviews-page.component.scss']
})
export class ReviewsPageComponent implements OnInit {
  public product!: DetailProduct;


  constructor
    (
      private route: ActivatedRoute,
      private accountService: AccountService,
      private lazyLoadingService: LazyLoadingService
    ) { }

  ngOnInit(): void {
    this.product = this.route.snapshot.parent?.data.product;
  }



  async onWriteReviewClick() {
    if (this.accountService.customer) {
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
          writeReviewForm.productImage = this.product.media[0].src;
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
}