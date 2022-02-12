import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { SummaryProduct } from 'common';

@Component({
  selector: 'product-summary',
  templateUrl: './product-summary.component.html',
  styleUrls: ['./product-summary.component.scss']
})
export class ProductSummaryComponent {
  @Input() product!: SummaryProduct;

  constructor(private router: Router) { }

  onClick() {
    this.router.navigate([this.product.urlName, this.product.urlId]);
  }
}