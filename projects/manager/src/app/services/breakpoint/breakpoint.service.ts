import { KeyValue } from '@angular/common';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Breakpoint } from '../../classes/breakpoint';
import { ViewPortDimension } from '../../classes/view-port-dimension';

@Injectable({
  providedIn: 'root'
})
export class BreakpointService {
  public currentBreakpoint: string = 'hd';
  public $breakpointChange: Subject<void> = new Subject<void>();
  private currentWindowWidth: number = 1600;
  public breakpoints: Array<Breakpoint> =
    [
      {
        name: 'mic',
        min: 0,
        max: 319
      },
      {
        name: 'xxs',
        min: 320,
        max: 479
      },
      {
        name: 'xs',
        min: 480,
        max: 599
      },
      {
        name: 'sm',
        min: 600,
        max: 767
      },
      {
        name: 'md',
        min: 768,
        max: 1023
      },
      {
        name: 'lg',
        min: 1024,
        max: 1279
      },
      {
        name: 'xl',
        min: 1280,
        max: 1439
      },
      {
        name: 'xxl',
        min: 1440,
        max: 1599
      },
      {
        name: 'hd',
        min: 1600,
        max: 2000
      }
    ]


    public viewPortDimensions: Array<KeyValue<string, ViewPortDimension>> = [
      {
        key: 'Responsive',
        value: {
          width: 1600,
          height: 800
        }
      },
      {
        key: 'BlackBerry Z30',
        value: {
          width: 360,
          height: 640
        }
      },
      {
        key: 'BlackBerry PlayBook',
        value: {
          width: 600,
          height: 1024
        }
      },
      {
        key: 'Galaxy S8',
        value: {
          width: 360,
          height: 740
        }
      },
      {
        key: 'Galaxy S9+',
        value: {
          width: 320,
          height: 658
        }
      },
      {
        key: 'Galaxy Tab S4',
        value: {
          width: 712,
          height: 1138
        }
      },
      {
        key: 'Kindle Fire HDX',
        value: {
          width: 800,
          height: 1280
        }
      },
      {
        key: 'LG Optimus L70',
        value: {
          width: 384,
          height: 640
        }
      },
      {
        key: 'Microsoft Lumia 550',
        value: {
          width: 640,
          height: 360
        }
      },
      {
        key: 'Nexus 5X',
        value: {
          width: 412,
          height: 732
        }
      },
      {
        key: 'Nexus 7',
        value: {
          width: 600,
          height: 960
        }
      },
      {
        key: 'Nokia Lumia 520',
        value: {
          width: 320,
          height: 533
        }
      },
      {
        key: 'Nokia N9',
        value: {
          width: 480,
          height: 854
        }
      },
      {
        key: 'Pixel 3',
        value: {
          width: 393,
          height: 786
        }
      },
      {
        key: 'Pixel 4',
        value: {
          width: 353,
          height: 745
        }
      },
      {
        key: 'iPad Mini',
        value: {
          width: 768,
          height: 1024
        }
      },
      {
        key: 'iPhone 4',
        value: {
          width: 320,
          height: 480
        }
      },
      {
        key: 'JioPhone 2',
        value: {
          width: 240,
          height: 320
        }
      },
      {
        key: 'iPhone SE',
        value: {
          width: 375,
          height: 667
        }
      },
      {
        key: 'iPhone XR',
        value: {
          width: 414,
          height: 896
        }
      },
      {
        key: 'iPhone 12 Pro',
        value: {
          width: 390,
          height: 844
        }
      },
      {
        key: 'Pixel 5',
        value: {
          width: 393,
          height: 851
        }
      },
      {
        key: 'Samsung Galaxy S20 Ultra',
        value: {
          width: 412,
          height: 915
        }
      },
      {
        key: 'iPad Air',
        value: {
          width: 820,
          height: 1180
        }
      },
      {
        key: 'Surface Pro 7',
        value: {
          width: 912,
          height: 1368
        }
      },
      {
        key: 'Surface Duo',
        value: {
          width: 540,
          height: 720
        }
      },
      {
        key: 'Galaxy Fold',
        value: {
          width: 280,
          height: 653
        }
      },
      {
        key: 'Galaxy A51/71',
        value: {
          width: 412,
          height: 914
        }
      },
      {
        key: 'Nest Hub',
        value: {
          width: 1024,
          height: 600
        }
      },
      {
        key: 'Nest Hub Max',
        value: {
          width: 1280,
          height: 800
        }
      },
      {
        key: 'Pixel 2',
        value: {
          width: 411,
          height: 731
        }
      },
      {
        key: 'Pixel 2 XL',
        value: {
          width: 411,
          height: 823
        }
      },
      {
        key: 'iPhone 5/SE',
        value: {
          width: 320,
          height: 568
        }
      },
      {
        key: 'iPhone 6/7/8 Plus',
        value: {
          width: 414,
          height: 736
        }
      },
      {
        key: 'iPhone X',
        value: {
          width: 375,
          height: 812
        }
      },
      {
        key: 'iPad Pro',
        value: {
          width: 1024,
          height: 1366
        }
      }
    ]
  
    public selectedViewPortDimension: KeyValue<string, ViewPortDimension> = this.viewPortDimensions[0];




  setCurrentBreakpoint(windowWidth: number) {
    this.breakpoints.forEach((breakpoint: Breakpoint) => {
      if (windowWidth >= breakpoint.min && windowWidth < breakpoint.max) {
        if (this.currentBreakpoint != breakpoint.name) {
          this.currentBreakpoint = breakpoint.name;
          this.currentWindowWidth = windowWidth;
          this.$breakpointChange.next();
        }
      }
    });
  }


  getBreakpoint(breakpointsArray: Array<number>): number | null {
    let minWindowSizes: Array<number> = [];

    // Get the min window sizes from the breakpoints array
    breakpointsArray.forEach(x => {
      minWindowSizes.push(this.breakpoints[x]?.min as number)
    });

    // Filter out all the window sizes that are less or equal to the current window width
    minWindowSizes = minWindowSizes.filter(x => x <= this.currentWindowWidth);

    // Return if none are found
    if (minWindowSizes.length == 0) return null;

    // Return the closest window size to the window width
    const minWindowSize = Math.max(...minWindowSizes);
    return this.breakpoints.findIndex(x => x.min == minWindowSize);
  }
}