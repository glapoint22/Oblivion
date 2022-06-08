import { Component, OnInit } from '@angular/core';
import { ProductGroupsFormUpdateManager } from '../../classes/product-groups-form-update-manager';

@Component({
  selector: 'form-product-groups',
  templateUrl: './form-product-groups.component.html',
  styleUrls: ['./form-product-groups.component.scss']
})
export class FormProductGroupsComponent extends ProductGroupsFormUpdateManager { }