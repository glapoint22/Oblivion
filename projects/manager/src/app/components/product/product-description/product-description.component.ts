import { Component, Input } from '@angular/core';
import { Product } from '../../../classes/product';

@Component({
  selector: 'product-description',
  templateUrl: './product-description.component.html',
  styleUrls: ['./product-description.component.scss']
})
export class ProductDescriptionComponent  {
  @Input() product!: Product;

  onChange(description: string) {
    this.product.description = description;
    // this.updateSubproduct(this.subproduct);
  }
}