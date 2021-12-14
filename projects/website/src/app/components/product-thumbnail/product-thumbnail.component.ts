import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Collaborator } from '../../classes/collaborator'
import { Image } from '../../classes/image';
import { Product } from '../../classes/product';

@Component({
  selector: 'product-thumbnail',
  templateUrl: './product-thumbnail.component.html',
  styleUrls: ['./product-thumbnail.component.scss']
})
export class ProductThumbnailComponent implements OnInit {
  @Input() product!: Product;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onClick() {
    this.router.navigate([this.product.urlTitle, this.product.urlId]);
  }

}
