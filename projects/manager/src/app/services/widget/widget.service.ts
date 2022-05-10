import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Widget, WidgetType } from 'widgets';
import { Breakpoint } from '../../classes/breakpoint';
import { WidgetCursorType } from '../../classes/enums';
import { WidgetCursor } from '../../classes/widget-cursor';
import { ColumnDevComponent } from '../../components/column-dev/column-dev.component';
import { RowDevComponent } from '../../components/row-dev/row-dev.component';

@Injectable({
  providedIn: 'root'
})
export class WidgetService {
  // public $widgetCursor: BehaviorSubject<WidgetCursor> = new BehaviorSubject<WidgetCursor>(new WidgetCursor());
  // public $widgetResize: BehaviorSubject<string> = new BehaviorSubject<string>('default');
  // public $pageChange: Subject<void> = new Subject<void>();
  // public $update: Subject<void> = new Subject<void>();
  // public page!: PageDevComponent;
  public selectedRow!: RowDevComponent;
  public selectedColumn!: ColumnDevComponent;
  public selectedWidget!: Widget;
  // private canvas!: HTMLCanvasElement;
  // private ctx!: CanvasRenderingContext2D;
  public currentBreakpoint: string = 'hd';
  public $breakpointChange: Subject<void> = new Subject<void>();
  private currentWindowWidth: number = 1600;
  private breakpoints: Array<Breakpoint> =
    [
      {
        name: 'micro',
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

  // public widgetCursors: Array<WidgetCursor> = [
  //   {
  //     // name: 'Text',
  //     // widgetType: WidgetType.Text,
  //     // className: 'fa-solid fa-align-left',
  //     // unicode: '\uf036',
  //     // fontSize: '24px',
  //     // x: 6,
  //     // y: 25,
  //     // widgetCursorType: WidgetCursorType.NotAllowed,
  //     // cursor: 'default'
  //   },
  //   {
  //     // name: 'Container',
  //     // widgetType: WidgetType.Container,
  //     // className: 'fa-solid fa-box-open',
  //     // unicode: '\uf49e',
  //     // fontSize: '24px',
  //     // x: 1,
  //     // y: 27,
  //     // widgetCursorType: WidgetCursorType.NotAllowed,
  //     // cursor: 'default'
  //   },
  //   {
  //     // name: 'Image',
  //     // widgetType: WidgetType.Image,
  //     // className: 'fa-solid fa-image',
  //     // unicode: '\uf03e',
  //     // fontSize: '26px',
  //     // x: 3,
  //     // y: 27,
  //     // widgetCursorType: WidgetCursorType.NotAllowed,
  //     // cursor: 'default'
  //   },
  //   {
  //     // name: 'Button',
  //     // widgetType: WidgetType.Button,
  //     // className: 'fa-solid fa-stop',
  //     // unicode: '\uf04d',
  //     // fontSize: '33px',
  //     // x: 4,
  //     // y: 28,
  //     // widgetCursorType: WidgetCursorType.NotAllowed,
  //     // cursor: 'default'
  //   },
  //   {
  //     // name: 'Line',
  //     // widgetType: WidgetType.Line,
  //     // className: 'fa-solid fa-slash',
  //     // unicode: '\uf715',
  //     // fontSize: '22px',
  //     // x: 4,
  //     // y: 25,
  //     // widgetCursorType: WidgetCursorType.NotAllowed,
  //     // cursor: 'default'
  //   },
  //   {
  //     // name: 'Video',
  //     // widgetType: WidgetType.Video,
  //     // className: 'fa-solid fa-film',
  //     // unicode: '\uf008',
  //     // fontSize: '25px',
  //     // x: 3,
  //     // y: 27,
  //     // widgetCursorType: WidgetCursorType.NotAllowed,
  //     // cursor: 'default'
  //   },
  //   {
  //     // name: 'Product Slider',
  //     // widgetType: WidgetType.ProductSlider,
  //     // className: 'fa-brands fa-product-hunt',
  //     // unicode: '\uf288',
  //     // fontSize: '25px',
  //     // x: 3,
  //     // y: 25,
  //     // widgetCursorType: WidgetCursorType.NotAllowed,
  //     // cursor: 'default'
  //   },
  //   {
  //     // name: 'Carousel',
  //     // widgetType: WidgetType.Carousel,
  //     // className: 'fa-solid fa-rotate',
  //     // unicode: '\uf2f1',
  //     // fontSize: '25px',
  //     // x: 3,
  //     // y: 25,
  //     // widgetCursorType: WidgetCursorType.NotAllowed,
  //     // cursor: 'default'
  //   },
  //   {
  //     // name: 'Grid',
  //     // widgetType: WidgetType.Grid,
  //     // className: 'fa-solid fa-table-cells-large',
  //     // unicode: '\uf009',
  //     // fontSize: '25px',
  //     // x: 3,
  //     // y: 25,
  //     // widgetCursorType: WidgetCursorType.NotAllowed,
  //     // cursor: 'default'
  //   }
  // ]


  // constructor() {
  //   this.canvas = document.createElement("canvas");
  //   this.canvas.width = 32;
  //   this.canvas.height = 32;
  //   this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
  // }


  // getWidgetCursor(widgetCursor: WidgetCursor): string {
  //   this.drawWidgetCursor(widgetCursor);

  //   return 'url(' + this.canvas.toDataURL() + '), auto';

  //   // this.$widgetCursor.next(widgetCursor);
  // }


  setWidgetCursorType(widgetCursorType: WidgetCursorType) {
    // let widgetCursor = this.$widgetCursor.getValue();

    // widgetCursor.widgetCursorType = widgetCursorType;
    // this.setWidgetCursor(widgetCursor);
  }



  // clearWidgetCursor() {
  //   // this.$widgetCursor.next(new WidgetCursor());
  // }


  // private drawWidgetCursor(widgetCursor: WidgetCursor) {
  //   // Clear the canvas
  //   this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

  //   // Font size
  //   this.ctx.font = widgetCursor.fontSize + ' fontawesome';

  //   // Background
  //   this.ctx.fillStyle = widgetCursor.widgetCursorType == WidgetCursorType.Allowed ? '#1898e382' : '#e3181882';
  //   this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

  //   // Stroke
  //   this.ctx.strokeStyle = widgetCursor.widgetCursorType == WidgetCursorType.Allowed ? '#0a9bef' : '#ef0a0a';
  //   this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);

  //   // Icon
  //   this.ctx.fillStyle = widgetCursor.widgetCursorType == WidgetCursorType.Allowed ? '#0d8af5' : '#f50d0d';
  //   this.ctx.fillText(widgetCursor.unicode, widgetCursor.x, widgetCursor.y);

  //   // Arrow
  //   this.ctx.fillStyle = '#e9e9e9';
  //   this.ctx.beginPath();
  //   this.ctx.moveTo(0, 0);
  //   this.ctx.lineTo(10, 0);
  //   this.ctx.lineTo(0, 10);
  //   this.ctx.fill();
  // }


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