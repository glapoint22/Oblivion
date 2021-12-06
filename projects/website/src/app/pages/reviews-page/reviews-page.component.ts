import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../classes/product';

@Component({
  selector: 'reviews-page',
  templateUrl: './reviews-page.component.html',
  styleUrls: ['./reviews-page.component.scss']
})
export class ReviewsPageComponent implements OnInit {
  public product!: Product;



  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.product = this.route.snapshot.parent?.data.product;
  }

}
