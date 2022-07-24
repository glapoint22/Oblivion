import { Injectable, ViewContainerRef } from '@angular/core';
import { HierarchyItem } from '../../classes/hierarchy-item';
import { MultiColumnItem } from '../../classes/multi-column-item';
import { Product } from '../../classes/product';
import { ProductPropertiesComponent } from '../../components/product-properties/product-properties.component';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  public product: Product = new Product();
  public zIndex: number = 0;

  constructor() {
    this.product.id = 1;
  }

  public productComponents: Array<ProductPropertiesComponent> = new Array<ProductPropertiesComponent>();

  public formFiltersArray: Array<HierarchyItem> = new Array<HierarchyItem>();
  public formFiltersSearchList: Array<MultiColumnItem> = new Array<MultiColumnItem>();




  public productsContainer!: ViewContainerRef;
}