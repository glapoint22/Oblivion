import { Component, Input } from '@angular/core';
import { DataService } from 'common';
import { Product } from '../../../classes/product';

@Component({
  selector: 'product-publish-button',
  templateUrl: './product-publish-button.component.html',
  styleUrls: ['./product-publish-button.component.scss']
})
export class ProductPublishButtonComponent  {
  @Input() product!: Product;
  constructor(private dataService: DataService) { }

  public onPublishClick(): void {
    this.dataService.post('api/Publish/PublishProduct', {
      productId: this.product.id
    }, {
      authorization: true
    }).subscribe();
  }
}