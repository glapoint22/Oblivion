import { Component } from '@angular/core';
import { AccountService, LazyLoadingService, SpinnerAction } from 'common';
import { CreatePasswordFormComponent } from '../../components/create-password-form/create-password-form.component';
import { ProfilePictureFormComponent } from '../../components/profile-picture-form/profile-picture-form.component';
import { Breadcrumb } from '../../classes/breadcrumb';
import { SocialMediaService } from '../../services/social-media/social-media.service';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  public breadcrumbs!: Array<Breadcrumb>;

  constructor
    (
      public accountService: AccountService,
      public lazyLoadingService: LazyLoadingService,
      private socialMediaService: SocialMediaService
    ) { }

  ngOnInit() {
    // Set the breadcrumbs
    this.breadcrumbs = [
      {
        link: {
          name: 'Your Account',
          route: '/account'
        }
      },
      {
        active: 'Your Profile'
      }
    ]

    this.socialMediaService.addMetaTags('Your Profile');
  }


  async onChangeNameClick() {
    this.lazyLoadingService.load(async () => {
      const { ChangeNameFormComponent } = await import('../../components/change-name-form/change-name-form.component');
      const { ChangeNameFormModule } = await import('../../components/change-name-form/change-name-form.module');

      return {
        component: ChangeNameFormComponent,
        module: ChangeNameFormModule
      }
    }, SpinnerAction.StartEnd);
  }


  async onChangeEmailClick() {
    this.lazyLoadingService.load(async () => {
      const { ChangeEmailFormComponent } = await import('../../components/change-email-form/change-email-form.component');
      const { ChangeEmailFormModule } = await import('../../components/change-email-form/change-email-form.module');

      return {
        component: ChangeEmailFormComponent,
        module: ChangeEmailFormModule
      }
    }, SpinnerAction.StartEnd);

  }


  async onChangePasswordClick() {
    // If user is changing their password
    if (!this.accountService.user?.externalLoginProvider || this.accountService.user.hasPassword) {
      this.lazyLoadingService.load(async () => {
        const { ChangePasswordFormComponent } = await import('../../components/change-password-form/change-password-form.component');
        const { ChangePasswordFormModule } = await import('../../components/change-password-form/change-password-form.module');

        return {
          component: ChangePasswordFormComponent,
          module: ChangePasswordFormModule
        }
      }, SpinnerAction.StartEnd);

      // If user is creating their password because they've been signing into a zuckabuck
    } else {
      this.lazyLoadingService.load(async () => {
        const { CreatePasswordFormComponent } = await import('../../components/create-password-form/create-password-form.component');
        const { CreatePasswordFormModule } = await import('../../components/create-password-form/create-password-form.module');

        return {
          component: CreatePasswordFormComponent,
          module: CreatePasswordFormModule
        }
      }, SpinnerAction.StartEnd)
        .then((createPasswordForm: CreatePasswordFormComponent) => {
          createPasswordForm.email = this.accountService.user?.email!;
          createPasswordForm.externalLoginProvider = this.accountService.user?.externalLoginProvider as string;
        });
    }
  }


  onChangeProfilePictureClick(fileInput: HTMLInputElement) {
    // Clear the picture select input (This is so the same filename can be re-entered again and again)
    fileInput.value = '';
    // Open the file explorer window
    fileInput.click();
  }



  async onImageSelect(fileInput: HTMLInputElement) {
    this.lazyLoadingService.load(async () => {
      const { ProfilePictureFormComponent } = await import('../../components/profile-picture-form/profile-picture-form.component');
      const { ProfilePictureFormModule } = await import('../../components/profile-picture-form/profile-picture-form.module');

      return {
        component: ProfilePictureFormComponent,
        module: ProfilePictureFormModule
      }
    }, SpinnerAction.Start)
      .then((profilePictureForm: ProfilePictureFormComponent) => {
        profilePictureForm.imageFile = fileInput.files![0];
      });
  }
}