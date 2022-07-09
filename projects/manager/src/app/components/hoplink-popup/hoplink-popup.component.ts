import { Component } from '@angular/core';
import { LazyLoad } from 'common';

@Component({
  selector: 'hoplink-popup',
  templateUrl: './hoplink-popup.component.html',
  styleUrls: ['./hoplink-popup.component.scss']
})
export class HoplinkPopupComponent extends LazyLoad {
  public isAdd!: boolean;
}