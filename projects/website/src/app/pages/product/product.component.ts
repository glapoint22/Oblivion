import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../classes/product';
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
        writeReviewForm.productName = this.product.name;
      });
  }
}