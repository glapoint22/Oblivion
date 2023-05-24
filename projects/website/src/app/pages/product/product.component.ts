import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountService, DataService, LazyLoadingService, PricePoint, SpinnerAction, Subproduct } from 'common';
import { Subscription } from 'rxjs';
import { DetailProduct } from '../../classes/detail-product';
import { RelatedProducts } from '../../classes/related-products';
import { WriteReviewFormComponent } from '../../components/write-review-form/write-review-form.component';
import { SocialMediaService } from '../../services/social-media/social-media.service';
import { Breadcrumb } from '../../classes/breadcrumb';

@Component({
  selector: 'product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  public product!: DetailProduct;
  public pricePoints!: Array<PricePoint>;
  public components!: Array<Subproduct>;
  public bonuses!: Array<Subproduct>;
  public relatedProducts!: RelatedProducts;
  public clientWidth!: number;
  public breadcrumbs!: Array<Breadcrumb>;

  constructor
    (
      private route: ActivatedRoute,
      public lazyLoadingService: LazyLoadingService,
      private accountService: AccountService,
      private socialMediaService: SocialMediaService,
      private dataService: DataService
    ) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.product = data.product;

      // Set the meta tags
      this.socialMediaService.addMetaTags(this.product.name, this.product.description, this.product.media[0].src);

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
          active: this.product.name
        }
      ]


      // This will get the rest of the product properties
      this.dataService.get('api/Products/GetProperties', [{ key: 'productId', value: this.product.id }])
        .subscribe((properties: any) => {
          this.pricePoints = properties.pricePoints;
          this.components = properties.components;
          this.bonuses = properties.bonuses;

          this.relatedProducts = null!;

          if (properties.relatedProducts && properties.relatedProducts.length > 0) {
            this.relatedProducts = {
              caption: 'Similar items you may like',
              products: properties.relatedProducts
            }
          }

        });
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