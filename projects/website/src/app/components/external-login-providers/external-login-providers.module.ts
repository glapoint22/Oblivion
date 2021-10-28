import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExternalLoginProvidersComponent } from './external-login-providers.component';
import { SocialLoginModule, SocialAuthServiceConfig, GoogleLoginProvider, FacebookLoginProvider, MicrosoftLoginProvider, AmazonLoginProvider } from 'angularx-social-login';



@NgModule({
  declarations: [ExternalLoginProvidersComponent],
  imports: [
    CommonModule,
    SocialLoginModule

  ],exports: [
    ExternalLoginProvidersComponent
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('154441452617-i5doq63c4dd12p5948051lgihmuqq7hb.apps.googleusercontent.com')
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('270837701134383')
          },
          {
            id: MicrosoftLoginProvider.PROVIDER_ID,
            provider: new MicrosoftLoginProvider('25f2a1b5-25cf-46c9-9840-2bbfa7006bb8')
          },
          {
            id: AmazonLoginProvider.PROVIDER_ID,
            provider: new AmazonLoginProvider('amzn1.application-oa2-client.183608300c524e37ba3b4c5db91f9d53')
          }
        ]
      } as SocialAuthServiceConfig,
    }
  ]
})
export class ExternalLoginProvidersModule { }