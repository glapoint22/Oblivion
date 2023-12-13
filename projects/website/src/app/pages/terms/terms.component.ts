import { Component } from '@angular/core';
import { PrivacyTerms } from '../../classes/privacy-terms';
import { LazyLoadingService } from 'common';
import { SocialMediaService } from '../../services/social-media/social-media.service';

@Component({
  selector: 'terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss']
})
export class TermsComponent extends PrivacyTerms {
  constructor(lazyLoadingService: LazyLoadingService, private socialMediaService: SocialMediaService) {
    super(lazyLoadingService)
  }

  ngOnInit(): void {
    // Set the meta tags
    this.socialMediaService.addMetaTags('Terms of Use');
  }
}