import { Component, ElementRef, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { AmazonLoginProvider, FacebookLoginProvider, GoogleLoginProvider, MicrosoftLoginProvider, SocialAuthService } from 'angularx-social-login';
import { SocialUser } from '../../classes/social-user';
import { DataService } from '../../services/data/data.service';

@Component({
  selector: 'external-login-providers',
  templateUrl: './external-login-providers.component.html',
  styleUrls: ['./external-login-providers.component.scss']
})
export class ExternalLoginProvidersComponent {
  @Input() signInType: string = '';
  @Output() onLogIn: EventEmitter<void> = new EventEmitter();
  @Output() onGetExternalLoginProviders: EventEmitter<Array<ElementRef<HTMLElement>>> = new EventEmitter();
  @ViewChildren('tabElement') HTMLElements!: QueryList<ElementRef<HTMLElement>>;

  constructor(private authService: SocialAuthService, private dataService: DataService) { }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID)
      .then((socialUser: SocialUser) => {
        this.signIn(socialUser);
      });
  }

  signInWithFacebook(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID)
      .then((socialUser: SocialUser) => {
        this.signIn(socialUser);
      });
  }


  signInWithMicrosoft(): void {
    this.authService.signIn(MicrosoftLoginProvider.PROVIDER_ID)
      .then((socialUser: SocialUser) => {
        this.signIn(socialUser);
      });
  }



  signInWithAmazon(): void {
    this.authService.signIn(AmazonLoginProvider.PROVIDER_ID)
      .then((socialUser: SocialUser) => {
        this.signIn(socialUser);
      });
  }


  signIn(socialUser: SocialUser) {
    this.dataService.post('api/Account/ExternalLogin', socialUser, { showSpinner: true })
      .subscribe(() => this.onLogIn.emit());
  }
}
