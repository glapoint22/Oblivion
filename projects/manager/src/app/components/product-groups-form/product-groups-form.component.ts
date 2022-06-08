import { Component, ViewChild } from '@angular/core';
import { LazyLoad } from 'common';
import { FormProductGroupsComponent } from '../form-product-groups/form-product-groups.component';

@Component({
  selector: 'product-groups-form',
  templateUrl: './product-groups-form.component.html',
  styleUrls: ['./product-groups-form.component.scss']
})
export class ProductGroupsFormComponent extends LazyLoad {
  @ViewChild('formProductGroups') formProductGroups!: FormProductGroupsComponent;


  ngAfterViewInit() {
    super.ngAfterViewInit();
    this.formProductGroups.onClose.subscribe(() => this.close());
  }


  onOpen(): void {
    this.formProductGroups.onOpen();
  }

  onEscape(): void {
    this.formProductGroups.onEscape();
  }
}