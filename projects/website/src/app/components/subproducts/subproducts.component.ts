import { Component, Input, OnInit } from '@angular/core';
import { Subproduct } from '../../classes/subproduct';

@Component({
  selector: 'subproducts',
  templateUrl: './subproducts.component.html',
  styleUrls: ['./subproducts.component.scss']
})
export class SubproductsComponent implements OnInit {
  @Input() components!: Array<Subproduct>;
  @Input() bonuses!: Array<Subproduct>;

  ngOnInit() {
    
  }
}