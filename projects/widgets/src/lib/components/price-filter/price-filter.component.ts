import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PriceFilter, PriceFilterOption } from 'common';
import { Filter } from '../../classes/filter';

@Component({
  selector: 'price-filter',
  templateUrl: './price-filter.component.html',
  styleUrls: ['./price-filter.component.scss']
})
export class PriceFilterComponent extends Filter<PriceFilter> {
  @ViewChild('priceForm', { static: false }) priceForm!: NgForm;
  public min!: string | undefined;
  public max!: string | undefined;
  public showClearPrice!: boolean;

  ngOnChanges(): void {
    super.ngOnChanges()
    const filterParam = this.filterParams.find(x => x.caption == 'Price Range');

    // This will populate or clear the min and max fields
    if (filterParam) {
      const prices = filterParam.options[0].split('-');
      this.min = prices[0];
      this.max = prices[1];
      this.showClearPrice = true;
    } else {
      this.resetPriceForm();
    }
  }



  onSubmit() {
    if (this.priceForm.valid) {
      const option = this.min + '-' + this.max;
      const filterParam = this.filterParams.find(x => x.caption == 'Price Range');

      // Create or update a filter param object based on the min and max fields
      if (filterParam) {
        filterParam.options = [option];
      } else {
        this.filterParams.push({
          caption: 'Price Range',
          options: [option]
        });
      }

      // Build the filter string for the url
      const filterString = this.buildFilterString();

      // Update the url with the new filter string
      this.updateUrl(filterString);
      this.showClearPrice = true;
    }
  }


  clearPrice() {
    const index = this.filterParams.findIndex(x => x.caption == 'Price Range');

    // This will clear the min and max fields and update the url
    if (index != -1) {
      this.filterParams.splice(index, 1);
      this.resetPriceForm();
      const filterString = this.buildFilterString();
      this.updateUrl(filterString);
    }
  }


  resetPriceForm() {
    // Reset the properties
    this.min = undefined;
    this.max = undefined;
    this.showClearPrice = false;
    if (this.priceForm) this.priceForm.resetForm();
  }

  trackPriceFilterOption(index: number, filterOption: PriceFilterOption) {
    return filterOption.label;
  }
}