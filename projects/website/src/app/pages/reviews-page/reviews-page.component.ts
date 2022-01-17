import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Product } from '../../classes/product';
import { WriteReviewFormComponent } from '../../components/write-review-form/write-review-form.component';
import { AccountService } from '../../services/account/account.service';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';

@Component({
  selector: 'reviews-page',
  templateUrl: './reviews-page.component.html',
  styleUrls: ['./reviews-page.component.scss']
})
export class ReviewsPageComponent implements OnInit {
  public product!: Product;
  private reviewsContainerElement!: HTMLElement;
  private headerContainerElement!: HTMLElement;



  constructor(private route: ActivatedRoute, private accountService: AccountService, private lazyLoadingService: LazyLoadingService) { }

  ngOnInit(): void {
    this.product = this.route.snapshot.parent?.data.product;
  }

  ngAfterViewInit() {
    this.reviewsContainerElement = document.getElementsByClassName('reviews-container')[0] as HTMLElement;
    this.headerContainerElement = document.getElementsByClassName('header-container')[0] as HTMLElement;

    this.route.queryParamMap.subscribe((queryParams: ParamMap) => {
      // Scroll to the top of the reviews
      if (queryParams.has('page')) {
        const pos = this.reviewsContainerElement.offsetTop - this.headerContainerElement.getBoundingClientRect().height;
        window.scrollTo(0, pos);
      }
    });
  }


  async onWriteReviewClick() {
    if (this.accountService.customer) {
      const { WriteReviewFormComponent } = await import('../../components/write-review-form/write-review-form.component');
      const { WriteReviewFormModule } = await import('../../components/write-review-form/write-review-form.module');

      this.lazyLoadingService.getComponentAsync(WriteReviewFormComponent, WriteReviewFormModule, this.lazyLoadingService.container)
        .then((writeReviewForm: WriteReviewFormComponent) => {
          writeReviewForm.productId = this.product.id;
          writeReviewForm.productImage = this.product.media[0].image;
          writeReviewForm.productName = this.product.name;
        });
    } else {
      this.logIn();
    }
  }


  async logIn() {
    const { LogInFormComponent } = await import('../../components/log-in-form/log-in-form.component');
    const { LogInFormModule } = await import('../../components/log-in-form/log-in-form.module')

    this.lazyLoadingService.getComponentAsync(LogInFormComponent, LogInFormModule, this.lazyLoadingService.container);
  }
}