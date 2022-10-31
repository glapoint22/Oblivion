import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { PricePoint } from 'common';
import { PricePointComponent } from '../price-point.component';

@Component({
  selector: 'price-point-header',
  templateUrl: './price-point-header.component.html',
  styleUrls: ['../../price-point/price-point.component.scss', './price-point-header.component.scss']
})
export class PricePointHeaderComponent extends PricePointComponent {
  public newPricePoint!: boolean;
  @Input() pricePoint!: PricePoint;
  @ViewChild('header') header!: ElementRef<HTMLElement>;


  ngAfterViewInit() {
    window.setTimeout(()=> {
      if(this.newPricePoint) this.header.nativeElement.focus();
    })
  }


  onHeaderBlur(pricePoint: PricePoint, htmlElement: HTMLElement) {
    window.getSelection()!.removeAllRanges();

    if (!(pricePoint.header == null && htmlElement.innerText.length == 0) && pricePoint.header != htmlElement.innerText) {
      pricePoint.header = htmlElement.innerText;
      this.updatePricePoint(pricePoint);
    }
  }


  onHeaderEscape(pricePoint: PricePoint, htmlElement: HTMLElement) {
    htmlElement.innerText = pricePoint.header ? pricePoint.header : '';
    htmlElement.blur();
  }
}