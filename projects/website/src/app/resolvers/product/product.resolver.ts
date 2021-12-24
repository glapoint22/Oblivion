import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { Collaborator } from '../../classes/collaborator';
import { RebillFrequency, ShippingType } from '../../classes/enums';
import { Image } from '../../classes/image';
import { Product } from '../../classes/product';
import { RecurringPayment } from '../../classes/recurring-payment';
import { RelatedProducts } from '../../classes/related-products';

@Injectable({
  providedIn: 'root'
})
export class ProductResolver implements Resolve<Product> {
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Product> {
    let product = new Product();


    product.title = 'Isometrics Mass';
    product.urlTitle = 'Isometrics-Mass';
    product.urlId = 'fjdsflsdfjsdl';
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


    product.components = [
      {
        title: 'Isometrics Mass Quick Start Video Guide',
        description: `
          <div>
              Getting started with a muscle-building program can be intimidating. Especially trying brand-new, powerful techniques 
              that will take your body and strength to the next level. And because you want to get started quickly and easily in minutes, 
              included are the Isometrics Mass Quick Start Video Guide.
          </div>

          <br>

          <div>
              This will show you exactly how to navigate through the program and begin using these fast-acting muscle and strength building 
              techniques for your very next workout. You’ll see just how easy it is to get started. No overwhelm. No confusion. Just a paint-by-numbers 
              guide to have you experiencing results moments from now.
          </div>
        `,
        image: {
          name: 'Isometrics Mass Quick Start Video Guide',
          url: 'YogaBurn.png'
        },
        value: 0
      },


      {
        title: 'Isometrics Mass Instructional Video Library',
        description: `
          <div>
              With the Isometrics Mass Instructional Library you'll be shown exactly how to perform every single movement in the program. 
              Not only will this accelerate your muscle and strength gains, but it will ensure you’re performing each movement safely and 
              with confidence that you’re getting the most out of every single set and rep.
          </div>
        `,
        image: {
          name: 'Isometrics Mass Instructional Video Library',
          url: '934f264eed7b4812905caf51b125eeb0.png'
        },
        value: 0
      }
    ]







    product.bonuses = [
      {
        title: 'Isometrics Mass Bodyweight Edition',
        description: `
          <div>
              Do you want to pile on pounds of mass using only your bodyweight? Fitness author and creator of Anabolic Running, 
              Joe LoGalbo, takes you through the Isometrics Mass Bodyweight Program. A bodyweight muscle-building routine you can 
              follow from anywhere to transform your physique.
          </div>

          <br>

          <div>
              No bands. No barbells. No gym. Simply follow these done-for-you workouts from home and build the strong and rock-solid 
              body that turns heads. These routines also act as a powerful “workout substitute” if you can’t make it to the gym, are a 
              frequent traveler, or you’re a bodyweight enthusiast who’d rather build dense muscle from your own living room.
          </div>
        `,
        image: {
          name: 'Isometrics Mass Bodyweight Edition',
          url: '39269e7f4f214cfaa3c2727ff54c5191.png'
        },
        value: 99
      },


      {
        title: 'Isometrics Mass Done-For-You Meal Plan',
        description: `
          <div>
              Also included is a done-for-you meal plan to fuel your workouts, accelerate recovery, and help you pack on more muscle and 
              strength faster that you thought possible.
          </div>

          <br>

          <div>
              Every single meal is laid out in an easy-to-follow format to give you the easiest and shortest path to success.
          </div>

          <Br>

          <div>
              ​​​​Warning: If you’re someone who enjoys tiny meals, green salads at every sitting, and insane amounts of protein, this is 
              not the meal plan for you.
          </div>
        

          <br>

          <div>
              No worries, you can still enjoy the benefits of the Isometrics Mass program regardless of your nutrition preferences. 
              This is simply a proven tool to accelerate your results.
          </div>
        `,
        image: {
          name: 'Isometrics Mass Done-For-You Meal Plan',
          url: '39514aea540048ab8e41c83cfd8fe63b.png'
        },
        value: 999
      }
    ]


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

    product.pricePoints =
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

    product.relatedProducts = new RelatedProducts();

    product.relatedProducts.caption = 'More related yoga products';
    product.relatedProducts.products = [
      {
        id: 17,
        urlId: 'C59B0E98DA',
        title: 'Cloud Stream Store',
        description: "",
        rating: 5,
        totalReviews: 20,
        minPrice: 99,
        maxPrice: 199,
        dateAdded: '',
        collaborator: new Collaborator(),
        hoplink: 'fdsasds',
        image: new Image('Cloud Stream Store','79b7ef34c27b4db98918e82326de9514.png'),
        urlTitle: 'Cloud-Stream-Store',
        additionalInfo: [],
        media: [],
        components: [],
        bonuses: [],
        oneStar: 8,
        twoStars: 2,
        threeStars: 3,
        fourStars: 4,
        fiveStars: 3,
        pricePoints: [],
        relatedProducts: new RelatedProducts()
      },



      {
        id: 68,
        urlId: 'B57B3452D5',
        title: 'Yoga Burn Total Body Challenge',
        description: "Alita Battle Angel takes place in a futuristic world where Alita Rules all.",
        rating: 5,
        totalReviews: 10,
        minPrice: 99,
        maxPrice: 199,
        dateAdded: '',
        collaborator: new Collaborator(),
        hoplink: 'fdsasds',
        image: new Image('Yoga Burn Total Body Challenge','161310e9f6c9414b9331b6fdc4b52cc7.png'),
        urlTitle: 'Yoga-Burn-Total-Body-Challenge',
        additionalInfo: [],
        media: [],
        components: [],
        bonuses: [],
        oneStar: 3,
        twoStars: 2,
        threeStars: 2,
        fourStars: 1,
        fiveStars: 2,
        pricePoints: [],
        relatedProducts: new RelatedProducts()
      },


      {
        id: 17,
        urlId: 'C59B0E98DA',
        title: 'Cloud Stream Store',
        description: "",
        rating: 5,
        totalReviews: 20,
        minPrice: 99,
        maxPrice: 199,
        dateAdded: '',
        collaborator: new Collaborator(),
        hoplink: 'fdsasds',
        image: new Image('Cloud Stream Store','79b7ef34c27b4db98918e82326de9514.png'),
        urlTitle: 'Cloud-Stream-Store',
        additionalInfo: [],
        media: [],
        components: [],
        bonuses: [],
        oneStar: 8,
        twoStars: 2,
        threeStars: 3,
        fourStars: 4,
        fiveStars: 3,
        pricePoints: [],
        relatedProducts: new RelatedProducts()
      },



      {
        id: 68,
        urlId: 'B57B3452D5',
        title: 'Yoga Burn Total Body Challenge',
        description: "Alita Battle Angel takes place in a futuristic world where Alita Rules all.",
        rating: 5,
        totalReviews: 10,
        minPrice: 99,
        maxPrice: 199,
        dateAdded: '',
        collaborator: new Collaborator(),
        hoplink: 'fdsasds',
        image: new Image('Yoga Burn Total Body Challenge','161310e9f6c9414b9331b6fdc4b52cc7.png'),
        urlTitle: 'Yoga-Burn-Total-Body-Challenge',
        additionalInfo: [],
        media: [],
        components: [],
        bonuses: [],
        oneStar: 3,
        twoStars: 2,
        threeStars: 2,
        fourStars: 1,
        fiveStars: 2,
        pricePoints: [],
        relatedProducts: new RelatedProducts()
      },


      {
        id: 17,
        urlId: 'C59B0E98DA',
        title: 'Cloud Stream Store',
        description: "",
        rating: 5,
        totalReviews: 20,
        minPrice: 99,
        maxPrice: 199,
        dateAdded: '',
        collaborator: new Collaborator(),
        hoplink: 'fdsasds',
        image: new Image('Cloud Stream Store','79b7ef34c27b4db98918e82326de9514.png'),
        urlTitle: 'Cloud-Stream-Store',
        additionalInfo: [],
        media: [],
        components: [],
        bonuses: [],
        oneStar: 8,
        twoStars: 2,
        threeStars: 3,
        fourStars: 4,
        fiveStars: 3,
        pricePoints: [],
        relatedProducts: new RelatedProducts()
      },



      {
        id: 68,
        urlId: 'B57B3452D5',
        title: 'Yoga Burn Total Body Challenge',
        description: "Alita Battle Angel takes place in a futuristic world where Alita Rules all.",
        rating: 5,
        totalReviews: 10,
        minPrice: 99,
        maxPrice: 199,
        dateAdded: '',
        collaborator: new Collaborator(),
        hoplink: 'fdsasds',
        image: new Image('Yoga Burn Total Body Challenge','161310e9f6c9414b9331b6fdc4b52cc7.png'),
        urlTitle: 'Yoga-Burn-Total-Body-Challenge',
        additionalInfo: [],
        media: [],
        components: [],
        bonuses: [],
        oneStar: 3,
        twoStars: 2,
        threeStars: 2,
        fourStars: 1,
        fiveStars: 2,
        pricePoints: [],
        relatedProducts: new RelatedProducts()
      },



      {
        id: 17,
        urlId: 'C59B0E98DA',
        title: 'Cloud Stream Store',
        description: "",
        rating: 5,
        totalReviews: 20,
        minPrice: 99,
        maxPrice: 199,
        dateAdded: '',
        collaborator: new Collaborator(),
        hoplink: 'fdsasds',
        image: new Image('Cloud Stream Store','79b7ef34c27b4db98918e82326de9514.png'),
        urlTitle: 'Cloud-Stream-Store',
        additionalInfo: [],
        media: [],
        components: [],
        bonuses: [],
        oneStar: 8,
        twoStars: 2,
        threeStars: 3,
        fourStars: 4,
        fiveStars: 3,
        pricePoints: [],
        relatedProducts: new RelatedProducts()
      },



      {
        id: 68,
        urlId: 'B57B3452D5',
        title: 'Yoga Burn Total Body Challenge',
        description: "Alita Battle Angel takes place in a futuristic world where Alita Rules all.",
        rating: 5,
        totalReviews: 10,
        minPrice: 99,
        maxPrice: 199,
        dateAdded: '',
        collaborator: new Collaborator(),
        hoplink: 'fdsasds',
        image: new Image('Yoga Burn Total Body Challenge','161310e9f6c9414b9331b6fdc4b52cc7.png'),
        urlTitle: 'Yoga-Burn-Total-Body-Challenge',
        additionalInfo: [],
        media: [],
        components: [],
        bonuses: [],
        oneStar: 3,
        twoStars: 2,
        threeStars: 2,
        fourStars: 1,
        fiveStars: 2,
        pricePoints: [],
        relatedProducts: new RelatedProducts()
      },



      {
        id: 17,
        urlId: 'C59B0E98DA',
        title: 'Cloud Stream Store',
        description: "",
        rating: 5,
        totalReviews: 20,
        minPrice: 99,
        maxPrice: 199,
        dateAdded: '',
        collaborator: new Collaborator(),
        hoplink: 'fdsasds',
        image: new Image('Cloud Stream Store','79b7ef34c27b4db98918e82326de9514.png'),
        urlTitle: 'Cloud-Stream-Store',
        additionalInfo: [],
        media: [],
        components: [],
        bonuses: [],
        oneStar: 8,
        twoStars: 2,
        threeStars: 3,
        fourStars: 4,
        fiveStars: 3,
        pricePoints: [],
        relatedProducts: new RelatedProducts()
      },



      {
        id: 68,
        urlId: 'B57B3452D5',
        title: 'Yoga Burn Total Body Challenge',
        description: "Alita Battle Angel takes place in a futuristic world where Alita Rules all.",
        rating: 5,
        totalReviews: 10,
        minPrice: 99,
        maxPrice: 199,
        dateAdded: '',
        collaborator: new Collaborator(),
        hoplink: 'fdsasds',
        image: new Image('Yoga Burn Total Body Challenge','161310e9f6c9414b9331b6fdc4b52cc7.png'),
        urlTitle: 'Yoga-Burn-Total-Body-Challenge',
        additionalInfo: [],
        media: [],
        components: [],
        bonuses: [],
        oneStar: 3,
        twoStars: 2,
        threeStars: 2,
        fourStars: 1,
        fiveStars: 2,
        pricePoints: [],
        relatedProducts: new RelatedProducts()
      },



      {
        id: 17,
        urlId: 'C59B0E98DA',
        title: 'Cloud Stream Store',
        description: "",
        rating: 5,
        totalReviews: 20,
        minPrice: 99,
        maxPrice: 199,
        dateAdded: '',
        collaborator: new Collaborator(),
        hoplink: 'fdsasds',
        image: new Image('Cloud Stream Store','79b7ef34c27b4db98918e82326de9514.png'),
        urlTitle: 'Cloud-Stream-Store',
        additionalInfo: [],
        media: [],
        components: [],
        bonuses: [],
        oneStar: 8,
        twoStars: 2,
        threeStars: 3,
        fourStars: 4,
        fiveStars: 3,
        pricePoints: [],
        relatedProducts: new RelatedProducts()
      },



      {
        id: 68,
        urlId: 'B57B3452D5',
        title: 'Yoga Burn Total Body Challenge',
        description: "Alita Battle Angel takes place in a futuristic world where Alita Rules all.",
        rating: 5,
        totalReviews: 10,
        minPrice: 99,
        maxPrice: 199,
        dateAdded: '',
        collaborator: new Collaborator(),
        hoplink: 'fdsasds',
        image: new Image('Yoga Burn Total Body Challenge','161310e9f6c9414b9331b6fdc4b52cc7.png'),
        urlTitle: 'Yoga-Burn-Total-Body-Challenge',
        additionalInfo: [],
        media: [],
        components: [],
        bonuses: [],
        oneStar: 3,
        twoStars: 2,
        threeStars: 2,
        fourStars: 1,
        fiveStars: 2,
        pricePoints: [],
        relatedProducts: new RelatedProducts()
      },



      {
        id: 17,
        urlId: 'C59B0E98DA',
        title: 'Cloud Stream Store',
        description: "",
        rating: 5,
        totalReviews: 20,
        minPrice: 99,
        maxPrice: 199,
        dateAdded: '',
        collaborator: new Collaborator(),
        hoplink: 'fdsasds',
        image: new Image('Cloud Stream Store','79b7ef34c27b4db98918e82326de9514.png'),
        urlTitle: 'Cloud-Stream-Store',
        additionalInfo: [],
        media: [],
        components: [],
        bonuses: [],
        oneStar: 8,
        twoStars: 2,
        threeStars: 3,
        fourStars: 4,
        fiveStars: 3,
        pricePoints: [],
        relatedProducts: new RelatedProducts()
      },



      {
        id: 68,
        urlId: 'B57B3452D5',
        title: 'Yoga Burn Total Body Challenge',
        description: "Alita Battle Angel takes place in a futuristic world where Alita Rules all.",
        rating: 5,
        totalReviews: 10,
        minPrice: 99,
        maxPrice: 199,
        dateAdded: '',
        collaborator: new Collaborator(),
        hoplink: 'fdsasds',
        image: new Image('Yoga Burn Total Body Challenge','161310e9f6c9414b9331b6fdc4b52cc7.png'),
        urlTitle: 'Yoga-Burn-Total-Body-Challenge',
        additionalInfo: [],
        media: [],
        components: [],
        bonuses: [],
        oneStar: 3,
        twoStars: 2,
        threeStars: 2,
        fourStars: 1,
        fiveStars: 2,
        pricePoints: [],
        relatedProducts: new RelatedProducts()
      },



      {
        id: 17,
        urlId: 'C59B0E98DA',
        title: 'Cloud Stream Store',
        description: "",
        rating: 5,
        totalReviews: 20,
        minPrice: 99,
        maxPrice: 199,
        dateAdded: '',
        collaborator: new Collaborator(),
        hoplink: 'fdsasds',
        image: new Image('Cloud Stream Store','79b7ef34c27b4db98918e82326de9514.png'),
        urlTitle: 'Cloud-Stream-Store',
        additionalInfo: [],
        media: [],
        components: [],
        bonuses: [],
        oneStar: 8,
        twoStars: 2,
        threeStars: 3,
        fourStars: 4,
        fiveStars: 3,
        pricePoints: [],
        relatedProducts: new RelatedProducts()
      },



      {
        id: 68,
        urlId: 'B57B3452D5',
        title: 'Yoga Burn Total Body Challenge',
        description: "Alita Battle Angel takes place in a futuristic world where Alita Rules all.",
        rating: 5,
        totalReviews: 10,
        minPrice: 99,
        maxPrice: 199,
        dateAdded: '',
        collaborator: new Collaborator(),
        hoplink: 'fdsasds',
        image: new Image('Yoga Burn Total Body Challenge','161310e9f6c9414b9331b6fdc4b52cc7.png'),
        urlTitle: 'Yoga-Burn-Total-Body-Challenge',
        additionalInfo: [],
        media: [],
        components: [],
        bonuses: [],
        oneStar: 3,
        twoStars: 2,
        threeStars: 2,
        fourStars: 1,
        fiveStars: 2,
        pricePoints: [],
        relatedProducts: new RelatedProducts()
      },



      {
        id: 17,
        urlId: 'C59B0E98DA',
        title: 'Cloud Stream Store',
        description: "",
        rating: 5,
        totalReviews: 20,
        minPrice: 99,
        maxPrice: 199,
        dateAdded: '',
        collaborator: new Collaborator(),
        hoplink: 'fdsasds',
        image: new Image('Cloud Stream Store','79b7ef34c27b4db98918e82326de9514.png'),
        urlTitle: 'Cloud-Stream-Store',
        additionalInfo: [],
        media: [],
        components: [],
        bonuses: [],
        oneStar: 8,
        twoStars: 2,
        threeStars: 3,
        fourStars: 4,
        fiveStars: 3,
        pricePoints: [],
        relatedProducts: new RelatedProducts()
      },



      {
        id: 68,
        urlId: 'B57B3452D5',
        title: 'Yoga Burn Total Body Challenge',
        description: "Alita Battle Angel takes place in a futuristic world where Alita Rules all.",
        rating: 5,
        totalReviews: 10,
        minPrice: 99,
        maxPrice: 199,
        dateAdded: '',
        collaborator: new Collaborator(),
        hoplink: 'fdsasds',
        image: new Image('Yoga Burn Total Body Challenge','161310e9f6c9414b9331b6fdc4b52cc7.png'),
        urlTitle: 'Yoga-Burn-Total-Body-Challenge',
        additionalInfo: [],
        media: [],
        components: [],
        bonuses: [],
        oneStar: 3,
        twoStars: 2,
        threeStars: 2,
        fourStars: 1,
        fiveStars: 2,
        pricePoints: [],
        relatedProducts: new RelatedProducts()
      },



      {
        id: 17,
        urlId: 'C59B0E98DA',
        title: 'Cloud Stream Store',
        description: "",
        rating: 5,
        totalReviews: 20,
        minPrice: 99,
        maxPrice: 199,
        dateAdded: '',
        collaborator: new Collaborator(),
        hoplink: 'fdsasds',
        image: new Image('Cloud Stream Store','79b7ef34c27b4db98918e82326de9514.png'),
        urlTitle: 'Cloud-Stream-Store',
        additionalInfo: [],
        media: [],
        components: [],
        bonuses: [],
        oneStar: 8,
        twoStars: 2,
        threeStars: 3,
        fourStars: 4,
        fiveStars: 3,
        pricePoints: [],
        relatedProducts: new RelatedProducts()
      },



      {
        id: 68,
        urlId: 'B57B3452D5',
        title: 'Yoga Burn Total Body Challenge',
        description: "Alita Battle Angel takes place in a futuristic world where Alita Rules all.",
        rating: 5,
        totalReviews: 10,
        minPrice: 99,
        maxPrice: 199,
        dateAdded: '',
        collaborator: new Collaborator(),
        hoplink: 'fdsasds',
        image: new Image('Yoga Burn Total Body Challenge','161310e9f6c9414b9331b6fdc4b52cc7.png'),
        urlTitle: 'Yoga-Burn-Total-Body-Challenge',
        additionalInfo: [],
        media: [],
        components: [],
        bonuses: [],
        oneStar: 3,
        twoStars: 2,
        threeStars: 2,
        fourStars: 1,
        fiveStars: 2,
        pricePoints: [],
        relatedProducts: new RelatedProducts()
      },



      {
        id: 17,
        urlId: 'C59B0E98DA',
        title: 'Cloud Stream Store',
        description: "",
        rating: 5,
        totalReviews: 20,
        minPrice: 99,
        maxPrice: 199,
        dateAdded: '',
        collaborator: new Collaborator(),
        hoplink: 'fdsasds',
        image: new Image('Cloud Stream Store','79b7ef34c27b4db98918e82326de9514.png'),
        urlTitle: 'Cloud-Stream-Store',
        additionalInfo: [],
        media: [],
        components: [],
        bonuses: [],
        oneStar: 8,
        twoStars: 2,
        threeStars: 3,
        fourStars: 4,
        fiveStars: 3,
        pricePoints: [],
        relatedProducts: new RelatedProducts()
      },



      {
        id: 68,
        urlId: 'B57B3452D5',
        title: 'Yoga Burn Total Body Challenge',
        description: "Alita Battle Angel takes place in a futuristic world where Alita Rules all.",
        rating: 5,
        totalReviews: 10,
        minPrice: 99,
        maxPrice: 199,
        dateAdded: '',
        collaborator: new Collaborator(),
        hoplink: 'fdsasds',
        image: new Image('Yoga Burn Total Body Challenge','161310e9f6c9414b9331b6fdc4b52cc7.png'),
        urlTitle: 'Yoga-Burn-Total-Body-Challenge',
        additionalInfo: [],
        media: [],
        components: [],
        bonuses: [],
        oneStar: 3,
        twoStars: 2,
        threeStars: 2,
        fourStars: 1,
        fiveStars: 2,
        pricePoints: [],
        relatedProducts: new RelatedProducts()
      },



      {
        id: 17,
        urlId: 'C59B0E98DA',
        title: 'Cloud Stream Store',
        description: "",
        rating: 5,
        totalReviews: 20,
        minPrice: 99,
        maxPrice: 199,
        dateAdded: '',
        collaborator: new Collaborator(),
        hoplink: 'fdsasds',
        image: new Image('Cloud Stream Store','79b7ef34c27b4db98918e82326de9514.png'),
        urlTitle: 'Cloud-Stream-Store',
        additionalInfo: [],
        media: [],
        components: [],
        bonuses: [],
        oneStar: 8,
        twoStars: 2,
        threeStars: 3,
        fourStars: 4,
        fiveStars: 3,
        pricePoints: [],
        relatedProducts: new RelatedProducts()
      },



      {
        id: 68,
        urlId: 'B57B3452D5',
        title: 'Yoga Burn Total Body Challenge',
        description: "Alita Battle Angel takes place in a futuristic world where Alita Rules all.",
        rating: 5,
        totalReviews: 10,
        minPrice: 99,
        maxPrice: 199,
        dateAdded: '',
        collaborator: new Collaborator(),
        hoplink: 'fdsasds',
        image: new Image('Yoga Burn Total Body Challenge','161310e9f6c9414b9331b6fdc4b52cc7.png'),
        urlTitle: 'Yoga-Burn-Total-Body-Challenge',
        additionalInfo: [],
        media: [],
        components: [],
        bonuses: [],
        oneStar: 3,
        twoStars: 2,
        threeStars: 2,
        fourStars: 1,
        fiveStars: 2,
        pricePoints: [],
        relatedProducts: new RelatedProducts()
      },



      
    ]


    return of(product);



  }
}
