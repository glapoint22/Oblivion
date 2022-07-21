import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { PricePoint, ShippingType } from 'common';

@Component({
  selector: 'price-points',
  templateUrl: './price-points.component.html',
  styleUrls: ['./price-points.component.scss']
})
export class PricePointsComponent {
  @Input() pricePoints!: Array<PricePoint>;
  @Input() hoplink!: string;
  @Input() clientWidth!: number; // Used for change
  @ViewChild('sliderContainer') sliderContainer!: ElementRef<HTMLElement>;
  public pricePointGroups: Array<any> = [];
  private classSet!: boolean;
  private pricePointGroupsSet!: boolean;
  public changeCount: number = 0;
  public shippingType = ShippingType;

  ngOnChanges() {
    this.classSet = false;
    this.pricePointGroupsSet = false;
    this.pricePointGroups = [];
  }

  ngDoCheck() {
    if (this.pricePoints && this.pricePoints.length > 0 && this.sliderContainer && !this.classSet) {
      let className: string = '';

      switch (this.pricePoints.length) {
        case 1:
          className = 'p1';
          break;

        case 2:
          className = 'p2';
          break;


        case 3:
          className = 'p3';
          break;


        case 4:
          className = 'p4';
          break;

        case 5:
          className = 'p5';
          break;

        case 6:
          className = 'p6';
          break;

        case 7:
          className = 'p7';
          break;

        case 8:
          className = 'p8';
          break;


        case 9:
          className = 'p9';
          break;


        case 10:
          className = 'p10';
          break;
      }

      this.sliderContainer.nativeElement.className = 'price-points-slider-container ' + className;
      this.classSet = true;
    }



    if (this.sliderContainer && this.sliderContainer.nativeElement.clientWidth > 0 && !this.pricePointGroupsSet) {
      const pricePointWidth: number = 330;
      const pricePointsPerGroup = Math.round(this.sliderContainer.nativeElement.clientWidth / pricePointWidth);

      for (let i = 0; i < this.pricePoints.length; i++) {
        if (i % pricePointsPerGroup == 0) this.pricePointGroups.push([]);

        this.pricePointGroups[this.pricePointGroups.length - 1].push(this.pricePoints[i]);
      }

      this.pricePointGroupsSet = true;
      this.changeCount++;

    }
  }



  onVisitOfficialWebsiteClick() {
    // Navigate to the product page
    window.open(this.hoplink, '_blank');
  }


  isWholeNumber(value: string): boolean {
    return parseFloat(value) % 1 == 0;
  }
}