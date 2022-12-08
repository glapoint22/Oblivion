import { Component, Input } from '@angular/core';
import { Subproduct } from 'common';
import { SubproductsComponent } from '../subproducts.component';

@Component({
  selector: 'subproduct-description',
  templateUrl: './subproduct-description.component.html',
  styleUrls: ['./subproduct-description.component.scss']
})
export class SubproductDescriptionComponent extends SubproductsComponent {
  @Input() subproduct!: Subproduct;

  onChange(description: string) {
    this.subproduct.description = description;
    this.updateSubproduct(this.subproduct);
  }
}