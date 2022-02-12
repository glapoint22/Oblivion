import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductRoutingModule } from './product-routing.module';
import { ProductComponent } from './product.component';
import { HeaderFooterModule } from '../../components/header-footer/header-footer.module';
import { ProductInfoModule } from '../../components/product-info/product-info.module';
import { SubproductsModule } from '../../components/subproducts/subproducts.module';
import { HelpfulReviewsModule } from '../../components/helpful-reviews/helpful-reviews.module';
import { ReviewsModule } from '../../components/reviews/reviews.module';
import { PricePointsModule } from '../../components/price-points/price-points.module';
import { ReviewSummaryModule } from 'common';
import { ProductSliderWidgetModule } from 'widgets';


@NgModule({
  declarations: [ProductComponent],
  imports: [
    CommonModule,
    ProductRoutingModule,
    HeaderFooterModule,
    ProductInfoModule,
    SubproductsModule,
    ReviewSummaryModule,
    HelpfulReviewsModule,
    ReviewsModule,
    PricePointsModule,
    ProductSliderWidgetModule
  ]
})
export class ProductModule { }
