import { Component } from '@angular/core';
import { LazyLoad } from 'common';

@Component({
  selector: 'recurring-popup',
  templateUrl: './recurring-popup.component.html',
  styleUrls: ['./recurring-popup.component.scss']
})
export class RecurringPopupComponent extends LazyLoad {
  public isAdd!: boolean;
}