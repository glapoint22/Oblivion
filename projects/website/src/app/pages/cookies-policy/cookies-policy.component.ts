import { Component } from '@angular/core';
import { PrivacyTerms } from '../../classes/privacy-terms';
import { LazyLoadingService } from 'common';
import { SocialMediaService } from '../../services/social-media/social-media.service';

@Component({
  selector: 'cookies-policy',
  templateUrl: './cookies-policy.component.html',
  styleUrls: ['../terms/terms.component.scss', './cookies-policy.component.scss']
})
export class CookiesPolicyComponent extends PrivacyTerms {
  constructor(lazyLoadingService: LazyLoadingService, private socialMediaService: SocialMediaService) {
    super(lazyLoadingService)
  }

  ngOnInit(): void {
    // Set the meta tags
    this.socialMediaService.addMetaTags('Cookies Policy');
  }
}