import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { RebillFrequency, ShippingType } from '../../classes/enums';
import { Product } from '../../classes/product';
import { RecurringPayment } from '../../classes/recurring-payment';

@Injectable({
  providedIn: 'root'
})
export class ProductResolver implements Resolve<Product> {
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Product> {
    let product = new Product();


    product.title = 'Isometrics Mass';
    product.rating = 3.552;
    product.totalReviews = 14;
    product.minPrice = 5.22;
    product.maxPrice = 19.99;
    product.oneStar = 5;
    product.twoStars = 2;
    product.threeStars = 3;
    product.fourStars = 2;
    product.fiveStars = 2;
    product.description = `
      <div>
          Isometrics Mass is a complete done-for-you mass and strength-building system allowing you to pack on bulging 
          muscle and gain superhuman strength without performing dangerous workouts or spending hours at the gym. It doesn't 
          matter your physical shape or current age. Isometrics Mass will enhance your strength and elevate your growth quicker 
          than you ever thought possible.
      </div>

      <br>

      <div>
          In this program, you discover powerful isometrics training techniques you can use anytime with zero equipment for instant 
          strength gains. You'll receive 8 Weeks of done-for-you workouts you can take to the gym or follow from home that will maximize 
          your muscle building and strength potential. You'll also learn what never to do when performing isometrics and why performing 
          heavy weight lifting exercises is not the best way to build muscle and strength.
      </div>

      <br>

      <div>
          The Isometrics Mass mission is to help busy, discouraged, and frustrated men reach the body of their dreams regardless of their age 
          or how busy they are without spending hours at the gym, getting burnt out, or struggling to balance family and their career. With this 
          powerful system, you'll feel like an invincible man that is full of energy, jacked, and fit. You'll have a lean and muscular physique 
          you can be proud of, and you won't have to settle for less any longer.
      </div>
    `;

    product.hoplink = 'https://4a2eeh0fn9qu0l62v2baud8rd0.hop.clickbank.net/';

    product.media = [
      {
        "name": "Isometrics Mass",
        "videoUrl": "",
        "image": {
          "url": '25b62112d0404e27acd91e0419c2ff56.png',
          "name": 'Isometrics Mass'
        },
        "type": 0
      },
      {
        "name": "Doodleoze",
        "videoUrl": "https://www.youtube.com/embed/-UT-SmkL1UE",
        "image": {
          "name": 'Doodleoze',
          "url": "7cb3582544e64702b483da7256dc8402.jpg"
        },

        "type": 1
      },
      {
        "name": "Doodleoze Demo",
        "videoUrl": "https://player.vimeo.com/video/431478238",
        "image": {
          "url": "f4769c0e59744f1b80b0273ef18e113e.jpg",
          "name": "Doodleoze Demo"
        },
        "type": 1
      },
      {
        "name": "Doodleoze Sample 1",
        "videoUrl": "https://player.vimeo.com/video/371204748",
        "image": {
          "url": "6d9fc396cd84467a8c1d45e6b649ba73.jpg",
          "name": "Doodleoze Sample 1"
        },
        "type": 1
      },
      {
        "name": "Doodleoze Sample 2",
        "videoUrl": "https://player.vimeo.com/video/371204828",
        "image": {
          "url": "4b26f6c893ff48f2aefb5825f1c483a0.jpg",
          "name": "Doodleoze Sample 2"
        },
        "type": 1
      },
      {
        "name": "Doodleoze Sample 3",
        "videoUrl": "https://player.vimeo.com/video/371204872",
        "image": {
          "url": "68bab811b2d14a8996e4f96a88744937.jpg",
          "name": "Doodleoze Sample 3"
        },
        "type": 1
      },
      {
        "name": "Doodleoze Sample 4",
        "videoUrl": "https://player.vimeo.com/video/371204917",
        "image": {
          "url": "ed2a8d3344ec4348951157ab7da53078.jpg",
          "name": "Doodleoze Sample 4"
        },
        "type": 1
      },
      {
        "name": "Doodleoze Sample 5",
        "videoUrl": "https://player.vimeo.com/video/371204934",
        "image": {
          "url": "aa722dc81d8c467faefddbd297f7f764.jpg",
          "name": "Doodleoze Sample 5"
        },
        "type": 1
      },
      {
        "name": "Doodleoze Sample 6",
        "videoUrl": "https://player.vimeo.com/video/371204977",
        "image": {
          "url": "acb35ef41f854443a3a9bc372079012b.jpg",
          "name": "Doodleoze Sample 6"
        },
        "type": 1
      },
      {
        "name": "Doodleoze Sample 7",
        "videoUrl": "https://player.vimeo.com/video/371205007",
        "image": {
          "url": "45e2bc5c08d8426d937ea44031c3b356.jpg",
          "name": "Doodleoze Sample 7"
        },
        "type": 1
      },
      {
        "name": "Doodleoze Sample 8",
        "videoUrl": "https://player.vimeo.com/video/371205042",
        "image": {
          "url": "9eb811fc83ab49fcbb37c7b88a95d929.jpg",
          "name": "Doodleoze Sample 8"
        },
        "type": 1
      }
    ];


    product.additionalInfo = [
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
    ];


    return of(product);



  }
}
