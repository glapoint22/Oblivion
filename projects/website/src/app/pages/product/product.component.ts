import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Caption } from '../../classes/caption';
import { Product } from '../../classes/product';
import { LogInFormComponent } from '../../components/log-in-form/log-in-form.component';
import { WriteReviewFormComponent } from '../../components/write-review-form/write-review-form.component';
import { AccountService } from '../../services/account/account.service';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';
import { SocialMediaService } from '../../services/social-media/social-media.service';
import { SpinnerService } from '../../services/spinner/spinner.service';

@Component({
  selector: 'product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  public product!: Product;
  public caption: Caption = new Caption();
  public clientWidth!: number;

  constructor
    (
      private route: ActivatedRoute,
      private lazyLoadingService: LazyLoadingService,
      private accountService: AccountService,
      private spinnerService: SpinnerService,
      private socialMediaService: SocialMediaService
    ) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.product = data.product;
      this.caption.text = this.product.relatedProducts.caption;
      this.socialMediaService.addMetaTags(this.product.name, this.product.description, this.product.media[0].image);
    });

    this.onWindowResize();
  }

  onVisitOfficialWebsiteClick() {
    // Navigate to the product page
    window.open(this.product.hoplink, '_blank');
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


  @HostListener('window:resize')
  onWindowResize() {
    this.clientWidth = document.documentElement.clientWidth;
  }
}