import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MediaType, RebillFrequency, ShippingType } from '../../classes/enums';
import { Media } from '../../classes/media';
import { Product } from '../../classes/product';
import { RecurringPayment } from '../../classes/recurring-payment';
import { AddToListFormComponent } from '../../components/add-to-list-form/add-to-list-form.component';
import { ReportItemFormComponent } from '../../components/report-item-form/report-item-form.component';
import { WriteReviewFormComponent } from '../../components/write-review-form/write-review-form.component';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';

@Component({
  selector: 'product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  public product!: Product;



  constructor(private route: ActivatedRoute, private lazyLoadingService: LazyLoadingService) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.product = data.product;
    })
  }

  onVisitOfficialWebsiteClick() {
    // Navigate to the product page
    window.open(this.product.hoplink, '_blank');
  }


  async onWriteReviewClick() {
    const { WriteReviewFormComponent } = await import('../../components/write-review-form/write-review-form.component');
    const { WriteReviewFormModule } = await import('../../components/write-review-form/write-review-form.module');

    this.lazyLoadingService.getComponentAsync(WriteReviewFormComponent, WriteReviewFormModule, this.lazyLoadingService.container)
      .then((writeReviewForm: WriteReviewFormComponent) => {
        writeReviewForm.productId = this.product.id;
        writeReviewForm.productImage = this.product.media[0].image;
      });
  }
}