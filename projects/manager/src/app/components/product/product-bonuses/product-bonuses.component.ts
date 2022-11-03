import { Component, Input } from '@angular/core';
import { DataService, Subproduct } from 'common';
import { SubproductType } from '../../../classes/enums';
import { Product } from '../../../classes/product';

@Component({
  selector: 'product-bonuses',
  templateUrl: './product-bonuses.component.html',
  styleUrls: ['../product.component.scss', './product-bonuses.component.scss']
})
export class ProductBonusesComponent  {
  public subproductType = SubproductType;
  @Input() product!: Product;


  constructor(private dataService: DataService) { }

  
  addSubproduct(type: SubproductType) {
    let subproduct: Subproduct;

    if (type == SubproductType.Component) {
      this.product.components = [];
      this.product.components.push(new Subproduct());
      subproduct = this.product.components[0];
    } else {
      this.product.bonuses = [];
      this.product.bonuses.push(new Subproduct());
      subproduct = this.product.bonuses[0];
    }



    this.dataService.post<number>('api/Products/Subproduct', {
      productId: this.product.id,
      type: type
    }).subscribe((id: number) => {
      subproduct.id = id;
    });
  }
}