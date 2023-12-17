import { Component, ElementRef, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { SocialUser } from '../../classes/social-user';
import { AmazonLoginProvider, MicrosoftLoginProvider, SocialAuthService } from '@abacritt/angularx-social-login';
import { SocialMediaService } from '../../services/social-media/social-media.service';
import { DataService, SpinnerAction } from 'common';
import { Subscription } from 'rxjs';

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
  private dataServicePostSubscription!: Subscription;

  constructor(private authService: SocialAuthService, private dataService: DataService, private socialMediaService: SocialMediaService) { }

  ngAfterViewInit(): void {
    this.onGetExternalLoginProviders.emit(this.HTMLElements.toArray());

    if (this.socialMediaService.onGoogleSignInSubscription) this.socialMediaService.onGoogleSignInSubscription.unsubscribe();

    this.socialMediaService.onGoogleSignInSubscription = this.socialMediaService.onGoogleSignIn.subscribe((user: SocialUser) => {
      this.signIn(user);
    });
  }

  // signInWithFacebook(): void {
  //   this.authService.signIn(FacebookLoginProvider.PROVIDER_ID)
  //     .then((socialUser: SocialUser) => {
  //       this.signIn(socialUser);
  //     });
  // }


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
    this.dataServicePostSubscription = this.dataService.post('api/Account/ExternalLogin', socialUser, { spinnerAction: SpinnerAction.StartEnd })
      .subscribe(() => this.onLogIn.emit());
  }



  ngOnDestroy() {
    if (this.dataServicePostSubscription) this.dataServicePostSubscription.unsubscribe();
  }
}
