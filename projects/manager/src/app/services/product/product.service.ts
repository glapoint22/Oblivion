import { Injectable, ViewContainerRef } from '@angular/core';
import { Product } from '../../classes/product';
import { ProductPropertiesComponent } from '../../components/product-properties/product-properties.component';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  public product: Product = new Product();
  constructor() {
    this.product.id = 1;
  }

  public productComponents: Array<ProductPropertiesComponent> = new Array<ProductPropertiesComponent>();

  public productsContainer!: ViewContainerRef;
}