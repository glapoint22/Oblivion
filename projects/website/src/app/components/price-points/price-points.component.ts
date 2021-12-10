import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { AdditionalInfo } from '../../classes/additional-info';
import { ShippingType, RebillFrequency } from '../../classes/enums';
import { PricePoint } from '../../classes/price-point';
import { RecurringPayment } from '../../classes/recurring-payment';

@Component({
  selector: 'price-points',
  templateUrl: './price-points.component.html',
  styleUrls: ['./price-points.component.scss']
})
export class PricePointsComponent {
  public pricePoints: Array<PricePoint> =
    [
      {
        header: '1 BOTTLE',
        quantity: '30 Day Supply',
        image: {
          name: '1 Bottle',
          url: '1Bottle.png'
        },
        unitPrice: '2.97',
        unit: 'day',
        strikethroughPrice: '127',
        price: '89',
        additionalInfo: [
          {
            id: 1,
            isRecurring: false,
            shippingType: ShippingType.PlusShipping,
            recurringPayment: new RecurringPayment()
          },
          {
            id: 2,
            isRecurring: true,
            shippingType: ShippingType.None,
            recurringPayment: {
              trialPeriod: 5,
              price: 15.84,
              rebillFrequency: RebillFrequency.Months,
              timeFrameBetweenRebill: 3,
              subscriptionDuration: 4
            }
          }
        ]
      },




      {
        header: '6 BOTTLES',
        quantity: '180 Day Supply',
        image: {
          name: '6 Bottle',
          url: '6Bottles.png'
        },
        unitPrice: '1.63',
        unit: 'day',
        strikethroughPrice: '587',
        price: '294',
        additionalInfo: [
          {
            id: 1,
            isRecurring: false,
            shippingType: ShippingType.PlusShipping,
            recurringPayment: new RecurringPayment()
          }
          
        ]
      },




      {
        header: '3 BOTTLES',
        quantity: '90 Day Supply',
        image: {
          name: '3 Bottle',
          url: '3Bottles.png'
        },
        unitPrice: '1.97',
        unit: 'day',
        strikethroughPrice: '347',
        price: '177',
        additionalInfo: [
          {
            id: 1,
            isRecurring: false,
            shippingType: ShippingType.FreeShipping,
            recurringPayment: new RecurringPayment()
          }
          
        ]
      }
    ];







  // public pp: Array<any> = new Array<any>(1);

  // public additionalInfo: Array<AdditionalInfo> = [
  //   {
  //     id: 1,
  //     isRecurring: false,
  //     shippingType: ShippingType.PlusShipping,
  //     recurringPayment: new RecurringPayment()
  //   },
  //   {
  //     id: 2,
  //     isRecurring: true,
  //     shippingType: ShippingType.None,
  //     recurringPayment: {
  //       trialPeriod: 5,
  //       price: 15.84,
  //       rebillFrequency: RebillFrequency.Months,
  //       timeFrameBetweenRebill: 3,
  //       subscriptionDuration: 4
  //     }
  //   }
  // ]

  constructor() { }









}