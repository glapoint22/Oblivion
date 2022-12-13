import { Component, Input, ViewChild } from '@angular/core';
import { PricePoint } from 'common';
import { Product } from '../../../classes/product';
import { PricePointsComponent } from './price-points/price-points.component';

@Component({
  selector: 'product-price-points',
  templateUrl: './product-price-points.component.html',
  styleUrls: ['../product.component.scss', './product-price-points.component.scss']
})
export class ProductPricePointsComponent {
  @Input() product!: Product;
  @ViewChild('pricePoints') pricePoints!: PricePointsComponent;

  // ==================================================================( ADD PRICE POINT )================================================================== \\

  addPricePoint() {
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