import { Component, Input, ViewChild } from '@angular/core';
import { DataService, PricePoint } from 'common';
import { Product } from '../../../classes/product';
import { PricePointsComponent } from './price-points/price-points.component';

@Component({
  selector: 'product-price-points',
  templateUrl: './product-price-points.component.html',
  styleUrls: ['./product-price-points.component.scss']
})
export class ProductPricePointsComponent {
  @Input() product!: Product;
  @ViewChild('pricePoints') pricePoints!: PricePointsComponent;


  constructor(private dataService: DataService) { }
  

  addPricePoint() {
    // If the product currently has a single price
    if (this.product.minPrice != null) {
      // Remove that single price from the database
      this.dataService.delete('api/Products/Price', { productId: this.product.id }).subscribe();
    }

    // Add a price point to the product
    this.product.pricePoints.push(new PricePoint());

    // Wait a frame so that the pricepoints component can be referenced
    window.setTimeout(() => {
      // Create the price point range
      this.pricePoints.updateMinMaxPrice();
      // Add the price point to the database
      this.pricePoints.addPricePoint();
    })
  }
}