import { Component } from '@angular/core';
import { PrivacyTerms } from '../../classes/privacy-terms';

@Component({
  selector: 'cookies-policy',
  templateUrl: './cookies-policy.component.html',
  styleUrls: ['../terms/terms.component.scss', './cookies-policy.component.scss']
})
export class CookiesPolicyComponent extends PrivacyTerms { }