import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ItemSelectType } from '../../../classes/enums';
import { List } from '../../../classes/list';

@Component({
  selector: 'item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent {
  public selected!: boolean;
  public selectType!: ItemSelectType | null;
  public SelectType = ItemSelectType;
  @Input() list!: List;
  @Input() id!: number;
  @Input() name!: string;
  @ViewChild('htmlItem') htmlItem!: ElementRef<HTMLElement>;
}