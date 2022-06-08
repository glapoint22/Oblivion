import { Component, OnInit } from '@angular/core';
import { FormKeywordsUpdateManager } from '../../classes/form-keywords-update-manager';

@Component({
  selector: 'form-keywords',
  templateUrl: './form-keywords.component.html',
  styleUrls: ['./form-keywords.component.scss']
})
export class FormKeywordsComponent extends FormKeywordsUpdateManager { }