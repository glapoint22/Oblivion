import { Component, OnInit } from '@angular/core';
import { Product } from '../../classes/product';

@Component({
  selector: 'product-properties',
  templateUrl: './product-properties.component.html',
  styleUrls: ['./product-properties.component.scss']
})
export class ProductPropertiesComponent implements OnInit {
  public zIndex!: number;
  public properties: Product = new Product();

  constructor() { }

  ngOnInit(): void {
  }

}
