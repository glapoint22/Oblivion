import { Component } from '@angular/core';
import { PrivacyTerms } from '../../classes/privacy-terms';

@Component({
  selector: 'privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['../terms/terms.component.scss', './privacy-policy.component.scss']
})
export class PrivacyPolicyComponent extends PrivacyTerms { }