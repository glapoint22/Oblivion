import { Component, Input } from '@angular/core';
import { AdditionalInfo } from '../../classes/additional-info';
import { RebillFrequency, ShippingType } from '../../classes/enums';
import { RecurringPayment } from '../../classes/recurring-payment';

@Component({
  selector: 'additional-info',
  templateUrl: './additional-info.component.html',
  styleUrls: ['./additional-info.component.scss']
})
export class AdditionalInfoComponent {
  @Input() additionalInfo!: Array<AdditionalInfo>;
  public shippingType = ShippingType;

  getShippingText(shippingType: ShippingType): string {
    let text: string;

    switch (shippingType) {
      case ShippingType.FreeShipping:
        text = 'Free Shipping';
        break;

      case ShippingType.FreeUsShipping:
        text = 'Free US Shipping';
        break;

      case ShippingType.PlusShipping:
        text = 'Plus Shipping';
        break;

      case ShippingType.JustPayShipping:
        text = 'Just Pay Shipping';
        break;

      default:
        text = '';
        break;
    }

    return text;
  }

  getPaymentText(recurringPayment: RecurringPayment): string {
    if (recurringPayment.price == 0) return '';

    let subscriptionDuration: string = '';
    let rebillFrequency: string = '';
    let hasSubscriptionDuration: boolean = recurringPayment.subscriptionDuration > 0;
    let hasRebillFrequency: boolean = recurringPayment.rebillFrequency != RebillFrequency.None &&
      recurringPayment.rebillFrequency != RebillFrequency.Days &&
      recurringPayment.rebillFrequency != RebillFrequency.Weeks &&
      recurringPayment.rebillFrequency != RebillFrequency.Months;
    let payment: string;


    // Subscription Duration
    if (hasSubscriptionDuration) {
      subscriptionDuration = recurringPayment.subscriptionDuration.toString();
    }


    // rebill Frequency
    if (hasRebillFrequency) {
      if (hasSubscriptionDuration) rebillFrequency = ' ';
      rebillFrequency += Object.values(RebillFrequency)[recurringPayment.rebillFrequency].toString().toLowerCase();

      if (!hasSubscriptionDuration) {
        rebillFrequency = rebillFrequency.charAt(0).toUpperCase() + rebillFrequency.slice(1);
      }
    }


    // Payment
    if (hasSubscriptionDuration || hasRebillFrequency) {
      payment = ' payment';
      if (hasSubscriptionDuration) payment += 's';
    } else {
      payment = 'Payment';
    }

    return subscriptionDuration + rebillFrequency + payment + ' of ';
  }





  getBillingText(recurringPayment: RecurringPayment): string {
    let trial: string = '';
    let billDate: string = '';



    if (recurringPayment.trialPeriod != 0) {
      trial = recurringPayment.trialPeriod + ' day trial: ';
    }

    if (recurringPayment.rebillFrequency != RebillFrequency.None) {
      billDate = 'Next payment will be billed on ' + this.getDate(recurringPayment) + '.';
    }

    return trial + billDate;
  }



  getTimeFrameBetweenRebill(recurringPayment: RecurringPayment): string {
    let timeFrameBetweenRebill: string = '';
    let hasTimeFrameBetweenRebill: boolean = this.hasTimeFrameBetweenRebill(recurringPayment.rebillFrequency);

    if (hasTimeFrameBetweenRebill) {
      timeFrameBetweenRebill = 'Payments are billed every ' +
        recurringPayment.timeFrameBetweenRebill + ' ' +
        Object.values(RebillFrequency)[recurringPayment.rebillFrequency].toString().toLowerCase() + '.';
    }

    return timeFrameBetweenRebill;
  }


  hasTimeFrameBetweenRebill(rebillFrequency: RebillFrequency): boolean {
    return rebillFrequency == RebillFrequency.Days ||
      rebillFrequency == RebillFrequency.Weeks ||
      rebillFrequency == RebillFrequency.Months;
  }


  getDate(recurringPayment: RecurringPayment): string {
    let date = new Date();

    // Days
    if (recurringPayment.trialPeriod > 0 || recurringPayment.rebillFrequency == RebillFrequency.Days) {
      let days = recurringPayment.trialPeriod > 0 ? recurringPayment.trialPeriod : recurringPayment.timeFrameBetweenRebill;

      date.setDate(date.getDate() + days);

      // Weeks
    } else if (recurringPayment.rebillFrequency == RebillFrequency.Weeks) {
      date.setDate(date.getDate() + recurringPayment.timeFrameBetweenRebill * 7);

      // Weekly
    } else if (recurringPayment.rebillFrequency == RebillFrequency.Weekly) {
      date.setDate(date.getDate() + 7);


      // Bi-Weekly
    } else if (recurringPayment.rebillFrequency == RebillFrequency.BiWeekly) {
      date.setDate(date.getDate() + 14);


      // Months
    } else if (recurringPayment.rebillFrequency == RebillFrequency.Months) {
      date.setMonth(date.getMonth() + recurringPayment.timeFrameBetweenRebill);


      // Monthly
    } else if (recurringPayment.rebillFrequency == RebillFrequency.Monthly) {
      date.setMonth(date.getMonth() + 1);


      // Quarterly
    } else if (recurringPayment.rebillFrequency == RebillFrequency.Quarterly) {
      date.setMonth(date.getMonth() + 3);

      // Annual
    } else if (recurringPayment.rebillFrequency == RebillFrequency.Annual) {
      date.setMonth(date.getMonth() + 12);
    }

    let month = new Intl.DateTimeFormat('en', { month: 'short' }).format(date);
    let day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
    let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);

    return month + ' ' + day + ', ' + year;
  }
}
