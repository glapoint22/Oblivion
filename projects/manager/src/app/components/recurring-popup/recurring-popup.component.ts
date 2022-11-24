import { KeyValue } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { DropdownComponent, DropdownType, LazyLoad, RebillFrequency, RecurringPayment } from 'common';
import { Subject } from 'rxjs';
import { PopupArrowPosition } from '../../classes/enums';

@Component({
  selector: 'recurring-popup',
  templateUrl: './recurring-popup.component.html',
  styleUrls: ['./recurring-popup.component.scss']
})
export class RecurringPopupComponent extends LazyLoad {
  public datePickerOpen!: boolean;
  public arrowPosition!: PopupArrowPosition;
  public PopupArrowPosition = PopupArrowPosition;
  public recurringPayment: RecurringPayment = new RecurringPayment();
  public initialRecurringPayment: RecurringPayment = new RecurringPayment();
  public rebillFrequencyList: Array<KeyValue<string, number>> = [];
  public selectedRebillFrequency!: KeyValue<string, number>;
  public timeFrameBetweenRebillList: Array<KeyValue<string, number>> = [];
  public selectedTimeFrameBetweenRebill!: KeyValue<string, number>;
  public rebillFrequency = RebillFrequency;
  public callback!: Function;
  public onClose: Subject<void> = new Subject<void>();
  public rebillFrequencyDropdownTabElement!: ElementRef<HTMLElement>;
  public timeBetweenEachRebillDropdownTabElement!: ElementRef<HTMLElement>;
  public DropdownType = DropdownType;
  public submitButtonDisabled: boolean = true;
  @ViewChild('rebillFrequencyDropdown') rebillFrequencyDropdown!: DropdownComponent;
  @ViewChild('timeBetweenEachRebillDropdown') timeBetweenEachRebillDropdown!: DropdownComponent;

  // ---------------------------------------------------------------------- Ng On Init --------------------------------------------------
  public ngOnInit(): void {
    super.ngOnInit();
    let keys = Object.keys(RebillFrequency);
    let counter: number = 0;

    window.addEventListener('mousedown', this.mousedown);

    // This generates the rebill frequency dropdown list using the elements in the RebillFrequency enum
    for (let i = keys.length * 0.5; i < keys.length; i++) {
      let key = keys[i];
      let value = counter;
      this.rebillFrequencyList.push({ key: key, value: value });
      counter++;
    }

    // Set the selected rebill frequency
    this.selectedRebillFrequency = this.rebillFrequencyList[this.recurringPayment.rebillFrequency];


    // Generate the time frame between rebill list
    this.generateTimeFrameBetweenRebillList();

    // Set the selected time frame between rebill
    this.selectedTimeFrameBetweenRebill = this.timeFrameBetweenRebillList.find(x => x.value == this.recurringPayment.timeFrameBetweenRebill)!;



    this.initialRecurringPayment.recurringPrice = this.recurringPayment.recurringPrice;
    this.initialRecurringPayment.rebillFrequency = this.recurringPayment.rebillFrequency;
    this.initialRecurringPayment.subscriptionDuration = this.recurringPayment.subscriptionDuration;
    this.initialRecurringPayment.timeFrameBetweenRebill = this.recurringPayment.timeFrameBetweenRebill;
    this.initialRecurringPayment.trialPeriod = this.recurringPayment.trialPeriod;
  }






  showDatePicker(dateInput: any) {
    if (!this.datePickerOpen) {
      this.datePickerOpen = true;
      dateInput.showPicker();
    } else {
      this.datePickerOpen = false;
    }
  }


  ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.tabElements.splice(3, 0, this.rebillFrequencyDropdownTabElement);
    this.tabElements.splice(4, 0, this.timeBetweenEachRebillDropdownTabElement);
  }



  // ------------------------------------------------------------------ Mouse Down ----------------------------------------------
  mousedown = () => {
    if (!this.datePickerOpen && !this.rebillFrequencyDropdown.dropdownList && !this.timeBetweenEachRebillDropdown.dropdownList) this.close();

    if (this.datePickerOpen) this.datePickerOpen = false;
  }



  // ------------------------------------------------------------------ Get Trial Period Date ----------------------------------------------
  public getTrialPeriodDate(): string {
    if (this.recurringPayment.trialPeriod > 0) {
      const trialBillDate = new Date();
      trialBillDate.setDate(trialBillDate.getDate() + this.recurringPayment.trialPeriod);

      return trialBillDate.toISOString().substring(0, 10);
    }

    return new Date().toISOString().substring(0, 10);
  }




  // ------------------------------------------------------------------ On Trial Period Change ----------------------------------------------
  public onTrialPeriodChange(dateInput: HTMLInputElement): void {
    let diffDays: number = 0;
    let date1: any = new Date(new Date().toDateString());
    let date2: any = new Date(1970, 0, 1);

    this.datePickerOpen = false;

    date2.setMilliseconds(Date.parse(dateInput.value));

    // This will set the trial period based on which date was picked using the trial bill date input
    if (date2 > date1) {
      const diffTime = Math.abs(date2 - date1);


      // ******** NOTE *********
      // Code was changed from this:
      // diffDays = diffTime / (1000 * 60 * 60 * 24);
      // to:
      diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
      // Before Math.round was added, sometimes it would return a value with a decimal point
    }

    this.recurringPayment.trialPeriod = diffDays;

    this.onFieldChange();
  }







  // ------------------------------------------------------------------ Get Time Frame Between Rebill ----------------------------------------------
  public getTimeFrameBetweenRebill(): string {
    let keys = Object.keys(RebillFrequency);

    return keys[this.recurringPayment.rebillFrequency + (keys.length * 0.5)];
  }








  // ------------------------------------------------------------- Generate Time Frame Between Rebill List -------------------------------------------
  private generateTimeFrameBetweenRebillList(): void {
    let min!: number;
    let max!: number;

    this.timeFrameBetweenRebillList = [];

    // Populate the timeFrameBetweenRebillList based on which rebill frequency was picked
    switch (this.recurringPayment.rebillFrequency) {
      case RebillFrequency.Days:
        min = 2;
        max = 364;
        break;

      case RebillFrequency.Weeks:
        min = 3;
        max = 51;
        break;

      case RebillFrequency.Months:
        min = 2;
        max = 11;
        break;
    }


    for (let i = min; i < max + 1; i++) {
      this.timeFrameBetweenRebillList.push({ key: i + ' ' + this.getTimeFrameBetweenRebill(), value: i });
    }
  }







  // ------------------------------------------------------------- On Rebill Frequency Change -------------------------------------------
  public onRebillFrequencyChange(): void {
    this.recurringPayment.rebillFrequency = this.selectedRebillFrequency.value;
    this.generateTimeFrameBetweenRebillList();

    if (this.timeFrameBetweenRebillList.length > 0) {
      this.selectedTimeFrameBetweenRebill = this.timeFrameBetweenRebillList[0];
      this.recurringPayment.timeFrameBetweenRebill = this.selectedTimeFrameBetweenRebill.value;
    }

    this.onFieldChange();
  }





  // -------------------------------------------------------------- On Recurring Price Change -----------------------------------------------
  onRecurringPriceChange(recurringPriceInput: HTMLInputElement) {
    !(/^[0-9.]*$/i).test(recurringPriceInput.value) ? recurringPriceInput.value = recurringPriceInput.value.replace(/[^0-9.]/ig, '') : null;
    this.recurringPayment.recurringPrice = parseFloat(recurringPriceInput.value);
    this.onFieldChange();
  }







  // ------------------------------------------------------------- On Subscription Duration Change -------------------------------------------
  onSubscriptionDurationChange(subscriptionDurationInput: HTMLInputElement) {
    !(/^[0-9]*$/i).test(subscriptionDurationInput.value) ? subscriptionDurationInput.value = subscriptionDurationInput.value.replace(/[^0-9]/ig, '') : null;
    this.recurringPayment.subscriptionDuration = parseInt(subscriptionDurationInput.value);
    this.onFieldChange();
  }




  onFieldChange() {
    if(this.recurringPayment.recurringPrice != this.initialRecurringPayment.recurringPrice ||
    this.recurringPayment.rebillFrequency != this.initialRecurringPayment.rebillFrequency ||
    this.recurringPayment.subscriptionDuration !=  this.initialRecurringPayment.subscriptionDuration ||
    this.recurringPayment.timeFrameBetweenRebill != this.initialRecurringPayment.timeFrameBetweenRebill ||
    this.recurringPayment.trialPeriod != this.initialRecurringPayment.trialPeriod) {
      this.submitButtonDisabled = false;
    }else {
      this.submitButtonDisabled = true;
    }
  }




  // ------------------------------------------------------------------- On Submit Click --------------------------------------------------
  onSubmitClick(): void {
    this.callback(this.recurringPayment);
    this.close();
  }



  onEscape(): void {
    if (!this.rebillFrequencyDropdown.dropdownList && !this.timeBetweenEachRebillDropdown.dropdownList) super.onEscape();
  }


  // ------------------------------------------------------------------- Close --------------------------------------------------
  close(): void {
    super.close();
    this.onClose.next();
  }


  // ------------------------------------------------------------------- NG On Destroy --------------------------------------------------
  ngOnDestroy() {
    super.ngOnDestroy();
    window.removeEventListener('mousedown', this.mousedown);
  }
}