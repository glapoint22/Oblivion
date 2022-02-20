import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { WidgetType } from 'widgets';
import { WidgetCursorType } from '../../classes/enums';
import { WidgetCursor } from '../../classes/widget-cursor';

@Injectable({
  providedIn: 'root'
})
export class WidgetService {
  public $widgetCursor: BehaviorSubject<WidgetCursor> = new BehaviorSubject<WidgetCursor>(new WidgetCursor());
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;

  public widgetCursors: Array<WidgetCursor> = [
    {
      name: 'Text',
      widgetType: WidgetType.Text,
      className: 'fa-solid fa-align-left',
      unicode: '\uf036',
      fontSize: '24px',
      x: 6,
      y: 25,
      widgetCursorType: WidgetCursorType.NotAllowed,
      cursor: 'default'
    },
    {
      name: 'Container',
      widgetType: WidgetType.Container,
      className: 'fa-solid fa-box-open',
      unicode: '\uf49e',
      fontSize: '24px',
      x: 1,
      y: 27,
      widgetCursorType: WidgetCursorType.NotAllowed,
      cursor: 'default'
    },
    {
      name: 'Image',
      widgetType: WidgetType.Image,
      className: 'fa-solid fa-image',
      unicode: '\uf03e',
      fontSize: '26px',
      x: 3,
      y: 27,
      widgetCursorType: WidgetCursorType.NotAllowed,
      cursor: 'default'
    },
    {
      name: 'Button',
      widgetType: WidgetType.Button,
      className: 'fa-solid fa-stop',
      unicode: '\uf04d',
      fontSize: '33px',
      x: 4,
      y: 28,
      widgetCursorType: WidgetCursorType.NotAllowed,
      cursor: 'default'
    },
    {
      name: 'Line',
      widgetType: WidgetType.Line,
      className: 'fa-solid fa-slash',
      unicode: '\uf715',
      fontSize: '22px',
      x: 4,
      y: 25,
      widgetCursorType: WidgetCursorType.NotAllowed,
      cursor: 'default'
    },
    {
      name: 'Video',
      widgetType: WidgetType.Video,
      className: 'fa-solid fa-film',
      unicode: '\uf008',
      fontSize: '25px',
      x: 3,
      y: 27,
      widgetCursorType: WidgetCursorType.NotAllowed,
      cursor: 'default'
    },
    {
      name: 'Product Slider',
      widgetType: WidgetType.ProductSlider,
      className: 'fa-brands fa-product-hunt',
      unicode: '\uf288',
      fontSize: '25px',
      x: 3,
      y: 25,
      widgetCursorType: WidgetCursorType.NotAllowed,
      cursor: 'default'
    },
    {
      name: 'Carousel',
      widgetType: WidgetType.Carousel,
      className: 'fa-solid fa-rotate',
      unicode: '\uf2f1',
      fontSize: '25px',
      x: 3,
      y: 25,
      widgetCursorType: WidgetCursorType.NotAllowed,
      cursor: 'default'
    },
    {
      name: 'Grid',
      widgetType: WidgetType.Grid,
      className: 'fa-solid fa-table-cells-large',
      unicode: '\uf009',
      fontSize: '25px',
      x: 3,
      y: 25,
      widgetCursorType: WidgetCursorType.NotAllowed,
      cursor: 'default'
    }
  ]


  constructor() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = 32;
    this.canvas.height = 32;
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
  }


  setWidgetCursor(widgetCursor: WidgetCursor) {
    this.drawWidgetCursor(widgetCursor);

    widgetCursor.cursor = 'url(' + this.canvas.toDataURL() + '), auto';

    this.$widgetCursor.next(widgetCursor);
  }


  setWidgetCursorType(widgetCursorType: WidgetCursorType) {
    let widgetCursor = this.$widgetCursor.getValue();

    widgetCursor.widgetCursorType = widgetCursorType;
    this.setWidgetCursor(widgetCursor);
  }



  clearWidgetCursor() {
    this.$widgetCursor.next(new WidgetCursor());
  }


  private drawWidgetCursor(widgetCursor: WidgetCursor) {
    // Clear the canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Font size
    this.ctx.font = widgetCursor.fontSize + ' fontawesome';

    // Background
    this.ctx.fillStyle = widgetCursor.widgetCursorType == WidgetCursorType.Allowed ? '#1898e382' : '#e3181882';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Stroke
    this.ctx.strokeStyle = widgetCursor.widgetCursorType == WidgetCursorType.Allowed ? '#0a9bef' : '#ef0a0a';
    this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);

    // Icon
    this.ctx.fillStyle = widgetCursor.widgetCursorType == WidgetCursorType.Allowed ? '#0d8af5' : '#f50d0d';
    this.ctx.fillText(widgetCursor.unicode, widgetCursor.x, widgetCursor.y);

    // Arrow
    this.ctx.fillStyle = '#e9e9e9';
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(10, 0);
    this.ctx.lineTo(0, 10);
    this.ctx.fill();
  }
}