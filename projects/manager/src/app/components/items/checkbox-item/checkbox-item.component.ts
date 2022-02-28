import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CheckboxListManager } from '../../../classes/checkbox-list';
import { ItemComponent } from '../item/item.component';

@Component({
  selector: 'checkbox-item',
  templateUrl: './checkbox-item.component.html',
  styleUrls: ['../item/item.component.scss', './checkbox-item.component.scss']
})
export class CheckboxItemComponent extends ItemComponent {
  @Input() listManager!: CheckboxListManager;
  public isChecked!: boolean;
  @ViewChild('checkbox') checkbox!: ElementRef<HTMLInputElement>;

  changeCheckbox() {
    this.isChecked = !this.isChecked;
    this.checkbox.nativeElement.checked = this.isChecked;
    this.listManager.onCheckboxChange(this)
  }
}