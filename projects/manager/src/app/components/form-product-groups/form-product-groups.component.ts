import { Component } from '@angular/core';
import { FormProductGroupsUpdateManager } from '../../classes/form-product-groups-update-manager';

@Component({
  selector: 'form-product-groups',
  templateUrl: './form-product-groups.component.html',
  styleUrls: ['./form-product-groups.component.scss']
})
export class FormProductGroupsComponent extends FormProductGroupsUpdateManager { }