import { Component, Input } from '@angular/core';
import { Subproduct } from 'common';

@Component({
  selector: 'subproduct-description',
  templateUrl: './subproduct-description.component.html',
  styleUrls: ['./subproduct-description.component.scss']
})
export class SubproductDescriptionComponent {
  @Input() subproduct!: Subproduct;
}