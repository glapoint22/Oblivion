import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'carousel-widget',
  templateUrl: './carousel-widget.component.html',
  styleUrls: ['./carousel-widget.component.scss']
})
export class CarouselWidgetComponent implements OnInit {
  public banners: Array<any> = [
    {
      link: {
        url: '/account'
      },
      image: {
        url: 'Alita.png',
        name: 'Alita'
      }
    },

    {
      link: {
        url: '/trumpy-bear/fdsfasdfdl'
      },
      image: {
        url: 'Trumpy.png',
        name: 'Trumpy'
      }
    },

    {
      link: {
        url: '/account/orders'
      },
      image: {
        url: 'Stargate.png',
        name: 'Stargate'
      }
    },

    {
      link: {
        url: '/Buffy/fsdfas'
      },
      image: {
        url: 'Buffy.png',
        name: 'Buffy'
      }
    },

    {
      link: {
        url: '/Landscape/fsdfas'
      },
      image: {
        url: 'Landscape.png',
        name: 'Landscape'
      }
    }
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
