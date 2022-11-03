import { Component, ElementRef, ViewChild } from '@angular/core';
import { PricePointComponent } from '../price-point.component';

@Component({
  selector: 'price-point-header',
  templateUrl: './price-point-header.component.html',
  styleUrls: ['../../price-point/price-point.component.scss', './price-point-header.component.scss']
})
export class PricePointHeaderComponent extends PricePointComponent {
  public newPricePoint!: boolean;
  @ViewChild('header') header!: ElementRef<HTMLElement>;


  ngAfterViewInit() {
    window.setTimeout(()=> {
      if(this.newPricePoint) this.header.nativeElement.focus();
    })
  }
}