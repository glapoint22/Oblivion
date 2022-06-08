import { Component } from '@angular/core';
import { FormFiltersUpdateManager } from '../../classes/form-filters-update-manager';

@Component({
  selector: 'form-filters',
  templateUrl: './form-filters.component.html',
  styleUrls: ['./form-filters.component.scss']
})
export class FormFiltersComponent extends FormFiltersUpdateManager { }