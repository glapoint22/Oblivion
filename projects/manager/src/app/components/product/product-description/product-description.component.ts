import { Component, Input } from '@angular/core';
import { DataService } from 'common';
import { Product } from '../../../classes/product';

@Component({
  selector: 'product-description',
  templateUrl: './product-description.component.html',
  styleUrls: ['./product-description.component.scss']
})
export class ProductDescriptionComponent {
  @Input() product!: Product;

  constructor(private dataService: DataService) { }

  onChange(description: string) {
    this.dataService.put('api/Products/Description', {
      id: this.product.id,
      description: description
    }, {
      authorization: true
    }).subscribe();
  }
}