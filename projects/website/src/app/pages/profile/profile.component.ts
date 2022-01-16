import { Component } from '@angular/core';
import { ProfilePictureFormComponent } from '../../components/profile-picture-form/profile-picture-form.component';
import { AccountService } from '../../services/account/account.service';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

  constructor(public accountService: AccountService, private lazyLoadingService: LazyLoadingService) { }


  async onChangeNameClick() {
    const { ChangeNameFormComponent } = await import('../../components/change-name-form/change-name-form.component');
    const { ChangeNameFormModule } = await import('../../components/change-name-form/change-name-form.module');

    this.lazyLoadingService.getComponentAsync(ChangeNameFormComponent, ChangeNameFormModule, this.lazyLoadingService.container);
  }


  async onChangeEmailClick() {
    const { ChangeEmailFormComponent } = await import('../../components/change-email-form/change-email-form.component');
    const { ChangeEmailFormModule } = await import('../../components/change-email-form/change-email-form.module');

    this.lazyLoadingService.getComponentAsync(ChangeEmailFormComponent, ChangeEmailFormModule, this.lazyLoadingService.container);
  }


  async onChangePasswordClick() {
    const { ChangePasswordFormComponent } = await import('../../components/change-password-form/change-password-form.component');
    const { ChangePasswordFormModule } = await import('../../components/change-password-form/change-password-form.module');

    this.lazyLoadingService.getComponentAsync(ChangePasswordFormComponent, ChangePasswordFormModule, this.lazyLoadingService.container);
  }


  onChangeProfilePictureClick(fileInput: HTMLInputElement) {
    // Clear the picture select input (This is so the same filename can be re-entered again and again)
    fileInput.value = '';
    // Open the file explorer window
    fileInput.click();
  }



  async onImageSelect(fileInput: HTMLInputElement) {
    const { ProfilePictureFormComponent } = await import('../../components/profile-picture-form/profile-picture-form.component');
    const { ProfilePictureFormModule } = await import('../../components/profile-picture-form/profile-picture-form.module');

    this.lazyLoadingService.getComponentAsync(ProfilePictureFormComponent, ProfilePictureFormModule, this.lazyLoadingService.container)
    .then((profilePictureForm: ProfilePictureFormComponent) => {
      profilePictureForm.imageFile = fileInput.files![0];
    });
  }
}