import { Component, Input, OnInit } from '@angular/core';
import { AmazonLoginProvider, FacebookLoginProvider, GoogleLoginProvider, MicrosoftLoginProvider, SocialAuthService } from 'angularx-social-login';

@Component({
  selector: 'external-login-providers',
  templateUrl: './external-login-providers.component.html',
  styleUrls: ['../../../scss/vertical-line.scss', './external-login-providers.component.scss']
})
export class ExternalLoginProvidersComponent {
  constructor(private authService: SocialAuthService) { }
  @Input() signInType: string = '';


  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID)
      .then(socialUser => {
      });
  }

  signInWithFacebook(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID)
      .then(socialUser => {
      });
  }


  signInWithMicrosoft(): void {
    this.authService.signIn(MicrosoftLoginProvider.PROVIDER_ID)
      .then(socialUser => {
      });
  }



  signInWithAmazon(): void {
    this.authService.signIn(AmazonLoginProvider.PROVIDER_ID)
      .then(socialUser => {
      });
  }
}
