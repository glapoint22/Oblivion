import { Component } from '@angular/core';
import { PrivacyTerms } from '../../classes/privacy-terms';

@Component({
  selector: 'terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss']
})
export class TermsComponent extends PrivacyTerms { }