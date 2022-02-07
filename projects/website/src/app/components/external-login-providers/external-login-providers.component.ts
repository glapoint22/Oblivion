import { Component, ElementRef, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { AmazonLoginProvider, FacebookLoginProvider, GoogleLoginProvider, MicrosoftLoginProvider, SocialAuthService } from 'angularx-social-login';

@Component({
  selector: 'external-login-providers',
  templateUrl: './external-login-providers.component.html',
  styleUrls: ['./external-login-providers.component.scss']
})
export class ExternalLoginProvidersComponent {
  @Input() signInType: string = '';
  @Output() onGetExternalLoginProviders: EventEmitter<Array<ElementRef<HTMLElement>>> = new EventEmitter();
  @ViewChildren('tabElement') HTMLElements!: QueryList<ElementRef<HTMLElement>>;


  constructor(private authService: SocialAuthService) { }

  ngAfterViewInit(): void {
    this.onGetExternalLoginProviders.emit(this.HTMLElements.toArray());
  }

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
