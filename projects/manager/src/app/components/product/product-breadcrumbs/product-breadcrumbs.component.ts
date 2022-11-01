import { Component, Input } from '@angular/core';
import { Product } from '../../../classes/product';

@Component({
  selector: 'product-breadcrumbs',
  templateUrl: './product-breadcrumbs.component.html',
  styleUrls: ['./product-breadcrumbs.component.scss']
})
export class ProductBreadcrumbsComponent {
  @Input() product!: Product;
}