import { Component, Input, QueryList, ViewChildren } from '@angular/core';
import { DataService, PricePoint } from 'common';
import { Product } from '../../../../classes/product';
import { PricePointHeaderComponent } from './price-point/price-point-header/price-point-header.component';

@Component({
  selector: 'price-points',
  templateUrl: './price-points.component.html',
  styleUrls: ['./price-points.component.scss']
})
export class PricePointsComponent {
  @Input() product!: Product;
  @ViewChildren('header') header!: QueryList<PricePointHeaderComponent>;
  constructor(private dataService: DataService) { }


  // =================================================================( ADD PRICE POINT )=================================================================== \\

  addPricePoint(pushNewPricePoint?: boolean) {
    if (pushNewPricePoint) this.product.pricePoints.push(new PricePoint());

    window.setTimeout(() => {
      this.header.get(this.product.pricePoints.length - 1)!.newPricePoint = true;
    })


    this.dataService.post<number>('api/Products/PricePoint', {
      ProductId: this.product.id
    }).subscribe((pricePointId: number) => {
      this.product.pricePoints[this.product.pricePoints.length - 1].id = pricePointId;
    });
  }



  // ===============================================================( UPDATE MIN MAX PRICE )================================================================ \\

  updateMinMaxPrice() {
    if (this.product.pricePoints.length > 0) {
      const minPrice = Math.min(...this.product.pricePoints.map(x => parseFloat(x.price ? x.price : '0')));
      const maxPrice = Math.max(...this.product.pricePoints.map(x => parseFloat(x.price ? x.price : '0')));

      this.product.minPrice = minPrice;
      this.product.maxPrice = maxPrice == minPrice ? null! : maxPrice;

    } else {
      this.product.minPrice = null!;
      this.product.maxPrice = null!;
    }
  }

  

  // ================================================================( DELETE PRICE POINT )================================================================= \\

  deletePricePoint(pricePointIndex: number, pricePointId: number) {
    this.product.pricePoints.splice(pricePointIndex, 1);
    this.updateMinMaxPrice();

    this.dataService.delete('api/Products/PricePoint', {
      pricePointId: pricePointId
    }).subscribe();
  }
}