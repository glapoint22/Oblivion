import { Component, OnInit } from '@angular/core';
import { FiltersFormUpdateManager } from '../../classes/filters-form-update-manager';

@Component({
  selector: 'form-filters',
  templateUrl: './form-filters.component.html',
  styleUrls: ['./form-filters.component.scss']
})
export class FormFiltersComponent extends FiltersFormUpdateManager { }