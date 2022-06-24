import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Breakpoint } from '../../classes/breakpoint';

@Injectable({
  providedIn: 'root'
})
export class BreakpointService {
  public currentBreakpoint: string = 'hd';
  public $breakpointChange: Subject<void> = new Subject<void>();
  private currentWindowWidth: number = 1600;
  private breakpoints: Array<Breakpoint> =
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


  getBreakpoint(breakpointsArray: Array<string>): string | null {
    let minWindowSizes: Array<number> = [];

    // Get the min window sizes from the breakpoints array
    breakpointsArray.forEach(x => {
      minWindowSizes.push(this.breakpoints.find(z => z.name == x)?.min as number)
    });

    // Filter out all the window sizes that are less or equal to the current window width
    minWindowSizes = minWindowSizes.filter(x => x <= this.currentWindowWidth);

    // Return if none are found
    if (minWindowSizes.length == 0) return null;

    // Return the closest window size to the window width
    const minWindowSize = Math.max(...minWindowSizes);
    return this.breakpoints.find(x => x.min == minWindowSize)?.name as string;
  }




  getBreakpoints(breakpointsArray: Array<string>): Array<string> | null {
    let minWindowSizes: Array<number> = [];

    // Get the min window sizes from the breakpoints array
    breakpointsArray.forEach(x => {
      minWindowSizes.push(this.breakpoints.find(z => z.name == x)?.min as number)
    });

    // Filter out all the window sizes that are less or equal to the current window width
    minWindowSizes = minWindowSizes.filter(x => x <= this.currentWindowWidth);

    // Return if none are found
    if (minWindowSizes.length == 0) return null;

    // Return the closest window size to the window width
    // const minWindowSize = Math.max(...minWindowSizes);
    return this.breakpoints.filter(x => minWindowSizes.includes(x.min)).map(x => x.name)
  }
}
