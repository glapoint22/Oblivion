import { Component, OnInit } from '@angular/core';
import { KeywordsFormUpdateManager } from '../../classes/keywords-form-update-manager';

@Component({
  selector: 'form-keywords',
  templateUrl: './form-keywords.component.html',
  styleUrls: ['./form-keywords.component.scss']
})
export class FormKeywordsComponent extends KeywordsFormUpdateManager { }