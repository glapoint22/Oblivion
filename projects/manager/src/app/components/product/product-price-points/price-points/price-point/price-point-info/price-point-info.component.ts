import { Component } from '@angular/core';
import { PricePointComponent } from '../price-point.component';
import { DropdownType } from 'common';
import { KeyValue } from '@angular/common';

@Component({
  selector: 'price-point-info',
  templateUrl: './price-point-info.component.html',
  styleUrls: ['./price-point-info.component.scss']
})
export class PricePointInfoComponent extends PricePointComponent {
  public DropdownType = DropdownType;
  public selectedOption!: KeyValue<string, number>;
  public options = [
    {
      key: 'None',
      value: 0
    },
    {
      key: 'Best Value',
      value: 1
    },
    {
      key: 'Most Popular',
      value: 2
    }
  ]



  ngOnChanges() {
    this.selectedOption = this.options.find(x => x.value == this.pricePoint.info)!;
  }



  onDropdownChange(option: any) {
    this.pricePoint.info = option.value;
    this.selectedOption = this.options.find(x => x.value == this.pricePoint.info)!;
    this.updatePricePoint(this.pricePoint);
  }
}