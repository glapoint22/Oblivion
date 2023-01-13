import { Component, Input } from '@angular/core';
import { DataService } from 'common';
import { Product } from '../../../classes/product';

@Component({
  selector: 'product-breadcrumbs',
  templateUrl: './product-breadcrumbs.component.html',
  styleUrls: ['./product-breadcrumbs.component.scss']
})
export class ProductBreadcrumbsComponent {
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