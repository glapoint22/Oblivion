import { Component, ElementRef, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { AccountService, DataService, SpinnerAction } from 'common';
import { SocialUser } from '../../classes/social-user';
import { AmazonLoginProvider, FacebookLoginProvider, MicrosoftLoginProvider, SocialAuthService } from '@abacritt/angularx-social-login';

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

  constructor(private authService: SocialAuthService, private dataService: DataService, private accountService: AccountService) { }

  ngAfterViewInit(): void {
    this.onGetExternalLoginProviders.emit(this.HTMLElements.toArray());

    if (this.accountService.onGoogleSignInSubscription) this.accountService.onGoogleSignInSubscription.unsubscribe();

    this.accountService.onGoogleSignInSubscription = this.accountService.onGoogleSignIn.subscribe((user: SocialUser) => {
      this.signIn(user);
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
        const nameRegex = /^(\S+)\s+(\S+)$/; // Matches "FirstName LastName"
        const match = socialUser.name!.match(nameRegex);
        const firstName = match![1];
        const lastName = match![2];

        this.signIn({
          firstName: firstName,
          lastName: lastName,
          email: socialUser.email,
          provider: socialUser.provider
        });
      });
  }


  signIn(socialUser: SocialUser) {
    this.dataService.post('api/Account/ExternalLogin', socialUser, { spinnerAction: SpinnerAction.StartEnd })
      .subscribe(() => this.onLogIn.emit());
  }
}
