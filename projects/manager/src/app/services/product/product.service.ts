import { Injectable } from '@angular/core';
import { Product } from '../../classes/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  public product: Product = new Product();
  constructor() {
    this.product.id = 1;
  }
}