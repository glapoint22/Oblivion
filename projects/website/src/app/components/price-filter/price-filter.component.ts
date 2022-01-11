import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Filter } from '../../classes/filter';
import { FilterParam } from '../../classes/filter-param';
import { PriceFilter } from '../../classes/price-filter';

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

  ngOnInit() {
    super.ngOnInit();
    this.filterParmsSubject.subscribe((filterParams: Array<FilterParam>) => {
      const filterParam = filterParams.find(x => x.caption == 'Price Range');
      if (filterParam) {
        const prices = filterParam.options[0].split('-');
        this.min = prices[0];
        this.max = prices[1];
        this.showClearPrice = true;
      } else {
        this.resetPriceForm();
      }
    });
  }



  onSubmit() {
    if (this.priceForm.valid) {
      const option = this.min + '-' + this.max;
      const filterParam = this.filterParams.find(x => x.caption == 'Price Range');

      if (filterParam) {
        filterParam.options = [option];
      } else {
        this.filterParams.push({
          caption: 'Price Range',
          options: [option]
        });
      }



      const filterString = this.buildFilterString();

      this.updateUrl(filterString);
      this.showClearPrice = true;
    }
  }


  clearPrice() {
    const index = this.filterParams.findIndex(x => x.caption == 'Price Range');

    if (index != -1) {
      this.filterParams.splice(index, 1);
      this.resetPriceForm();
      const filterString = this.buildFilterString();

      this.updateUrl(filterString);
    }


  }


  resetPriceForm() {
    this.min = undefined;
    this.max = undefined;
    this.showClearPrice = false;
    if (this.priceForm) this.priceForm.resetForm();
  }


}