import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { WidgetType } from 'widgets';
import { SelectedWidgetIcon } from '../../classes/selected-widget-icon';
import { WidgetCursor } from '../../classes/widget-cursor';

@Injectable({
  providedIn: 'root'
})
export class WidgetService {
  public $selectedWidgetIcon: BehaviorSubject<SelectedWidgetIcon> = new BehaviorSubject<SelectedWidgetIcon>(new SelectedWidgetIcon());
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;

  public widgetCursors: Array<WidgetCursor> = [
    {
      name: 'Text',
      widgetType: WidgetType.Text,
      className: 'fa-solid fa-align-left',
      unicode: '\uf036',
      fontSize: '24px',
      x: 7,
      y: 27
    },
    {
      name: 'Container',
      widgetType: WidgetType.Container,
      className: 'fa-solid fa-box-open',
      unicode: '\uf49e',
      fontSize: '24px',
      x: 3,
      y: 27
    },
    {
      name: 'Image',
      widgetType: WidgetType.Image,
      className: 'fa-solid fa-image',
      unicode: '\uf03e',
      fontSize: '26px',
      x: 4,
      y: 28
    },
    {
      name: 'Button',
      widgetType: WidgetType.Button,
      className: 'fa-solid fa-stop',
      unicode: '\uf04d',
      fontSize: '33px',
      x: 5,
      y: 30
    },
    {
      name: 'Line',
      widgetType: WidgetType.Line,
      className: 'fa-solid fa-slash',
      unicode: '\uf715',
      fontSize: '22px',
      x: 5,
      y: 25
    },
    {
      name: 'Video',
      widgetType: WidgetType.Video,
      className: 'fa-solid fa-film',
      unicode: '\uf008',
      fontSize: '25px',
      x: 5,
      y: 27
    },
    {
      name: 'Product Slider',
      widgetType: WidgetType.ProductSlider,
      className: 'fa-brands fa-product-hunt',
      unicode: '\uf288',
      fontSize: '25px',
      x: 5,
      y: 27
    },
    {
      name: 'Carousel',
      widgetType: WidgetType.Carousel,
      className: 'fa-solid fa-rotate',
      unicode: '\uf2f1',
      fontSize: '25px',
      x: 5,
      y: 27
    },
    {
      name: 'Grid',
      widgetType: WidgetType.Grid,
      className: 'fa-solid fa-table-cells-large',
      unicode: '\uf009',
      fontSize: '25px',
      x: 5,
      y: 27
    }
  ]


  constructor() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = 35;
    this.canvas.height = 35;
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
  }


  getCursor(widgetCursor: WidgetCursor): string {
    // Clear the canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Font size
    this.ctx.font = widgetCursor.fontSize + ' fontawesome';

    // Background
    this.ctx.fillStyle = '#1898e382';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Stroke
    this.ctx.strokeStyle = '#0a9bef';
    this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);

    // Icon
    this.ctx.fillStyle = '#0d8af5';
    this.ctx.fillText(widgetCursor.unicode, widgetCursor.x, widgetCursor.y);

    // Arrow
    this.ctx.fillStyle = '#e9e9e9';
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(10, 0);
    this.ctx.lineTo(0, 10);
    this.ctx.fill();


    // Converting the canvas to image
    return this.canvas.toDataURL();
  }
}