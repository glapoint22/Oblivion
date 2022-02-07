import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product } from '../../classes/product';
import { LogInFormComponent } from '../../components/log-in-form/log-in-form.component';
import { WriteReviewFormComponent } from '../../components/write-review-form/write-review-form.component';
import { AccountService } from '../../services/account/account.service';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';
import { SpinnerService } from '../../services/spinner/spinner.service';

@Component({
  selector: 'reviews-page',
  templateUrl: './reviews-page.component.html',
  styleUrls: ['./reviews-page.component.scss']
})
export class ReviewsPageComponent implements OnInit {
  public product!: Product;


  constructor
    (
      private route: ActivatedRoute,
      private accountService: AccountService,
      private lazyLoadingService: LazyLoadingService,
      private spinnerService: SpinnerService
    ) { }

  ngOnInit(): void {
    this.product = this.route.snapshot.parent?.data.product;
  }



  async onWriteReviewClick(logInForm: LogInFormComponent | null) {
    if (this.accountService.customer) {
      this.spinnerService.show = true;
      const { WriteReviewFormComponent } = await import('../../components/write-review-form/write-review-form.component');
      const { WriteReviewFormModule } = await import('../../components/write-review-form/write-review-form.module');

      this.lazyLoadingService.getComponentAsync(WriteReviewFormComponent, WriteReviewFormModule, this.lazyLoadingService.container)
        .then((writeReviewForm: WriteReviewFormComponent) => {
          writeReviewForm.productId = this.product.id;
          writeReviewForm.productImage = this.product.media[0].image;
          writeReviewForm.productName = this.product.name;
          writeReviewForm.logInForm = logInForm;
          this.spinnerService.show = false;
        });
    } else {
      this.logIn();
    }
  }


  async logIn() {
    this.spinnerService.show = true;
    const { LogInFormComponent } = await import('../../components/log-in-form/log-in-form.component');
    const { LogInFormModule } = await import('../../components/log-in-form/log-in-form.module')

    this.lazyLoadingService.getComponentAsync(LogInFormComponent, LogInFormModule, this.lazyLoadingService.container)
      .then((logInForm: LogInFormComponent) => {
        const subscription: Subscription = this.accountService.onRedirect.subscribe(() => {
          this.onWriteReviewClick(logInForm);

          subscription.unsubscribe();
        });
        this.spinnerService.show = false;
      });
  }
}