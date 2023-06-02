import { KeyValue } from '@angular/common';
import { Component } from '@angular/core';
import { DropdownType, LazyLoad } from 'common';
import { Subject } from 'rxjs';

@Component({
  selector: 'currency-popup',
  templateUrl: './currency-popup.component.html',
  styleUrls: ['./currency-popup.component.scss']
})
export class CurrencyPopupComponent extends LazyLoad {
  public currency!: string;
  public callback!: Function;
  public DropdownType = DropdownType;
  public submitButtonDisabled: boolean = true;
  public onClose: Subject<void> = new Subject<void>();
  public currencies!: Array<KeyValue<string, string>>;
  public selectedCurrency!: KeyValue<string, string>;


  ngOnInit(): void {
    super.ngOnInit();
    this.selectedCurrency = this.currencies.find(x => x.value == this.currency) || this.currencies[0];
  }


  onSubmitClick() {
    this.callback(this.selectedCurrency);
    this.close();
  }


  onCurrencyChange(currency: KeyValue<string, string>) {
    if (currency != this.selectedCurrency) {
      this.selectedCurrency = currency;
      this.submitButtonDisabled = false;
    }
  }


  close(): void {
    super.close();
    this.onClose.next();
  }
}