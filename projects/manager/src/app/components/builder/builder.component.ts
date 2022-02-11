import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'builder',
  templateUrl: './builder.component.html',
  styleUrls: ['./builder.component.scss']
})
export class BuilderComponent implements OnInit {
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;

  constructor() { }

  ngOnInit(): void {
    this.canvas = document.createElement("canvas");

    this.canvas.width = 50;
    this.canvas.height = 50;

    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;

    // Setting the color of the icon
    this.ctx.fillStyle = "#0a9bef";

    // Set size of cursor
    this.ctx.font = "24px fontawesome";
  }


  onIconClick(unicode: string) {
    // Clear the canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // fill the canvas with the icon
    this.ctx.fillText(unicode, 0, 20);

    // Converting the canvas to image
    const dataURL = this.canvas.toDataURL();

    // Set the cursor
    document.body.style.cursor = "url(" + dataURL + "), auto";
  }

}
