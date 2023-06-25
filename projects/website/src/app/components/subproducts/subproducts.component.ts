import { Component, Input } from '@angular/core';
import { Subproduct } from 'common';

@Component({
  selector: 'subproducts',
  templateUrl: './subproducts.component.html',
  styleUrls: ['./subproducts.component.scss']
})
export class SubproductsComponent {
  @Input() components!: Array<Subproduct>;
  @Input() bonuses!: Array<Subproduct>;
  @Input () currency!: string;
}