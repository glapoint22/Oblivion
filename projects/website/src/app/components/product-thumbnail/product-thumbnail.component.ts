import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../classes/product';

@Component({
  selector: 'product-thumbnail',
  templateUrl: './product-thumbnail.component.html',
  styleUrls: ['./product-thumbnail.component.scss']
})
export class ProductThumbnailComponent {
  @Input() product!: Product;

  constructor(private router: Router) { }

  onClick() {
    this.router.navigate([this.product.urlName, this.product.urlId]);
  }
}