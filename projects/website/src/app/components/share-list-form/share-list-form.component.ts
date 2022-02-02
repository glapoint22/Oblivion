import { Component } from '@angular/core';
import { ShareListType } from '../../classes/enums';
import { LazyLoad } from '../../classes/lazy-load';
import { List } from '../../classes/list';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';
import { SocialMediaService } from '../../services/social-media/social-media.service';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { ManageCollaboratorsFormComponent } from '../manage-collaborators-form/manage-collaborators-form.component';
import { SuccessPromptComponent } from '../success-prompt/success-prompt.component';

@Component({
  selector: 'share-list-form',
  templateUrl: './share-list-form.component.html',
  styleUrls: ['./share-list-form.component.scss']
})
export class ShareListFormComponent extends LazyLoad {
  public shareListType!: ShareListType;
  public ShareListType = ShareListType;
  public list!: List;
  public manageCollaboratorsForm!: ManageCollaboratorsFormComponent;

  constructor(private lazyLoadingService: LazyLoadingService, private spinnerService: SpinnerService, private socialMediaService: SocialMediaService) {
    super();
  }

  onShareClick(socialType: string) {
    let pathName: string;
    let text: string;
    const collaborateInput = document.getElementById('collaborate') as HTMLInputElement;

    if (this.shareListType == ShareListType.Collaborate || (this.shareListType == ShareListType.Both && collaborateInput.checked)) {
      pathName = '/collaborate-list/' + this.list.collaborateId;
      text = 'You\'re invited to collaborate on list, ' + this.list.name + ':';
    } else {
      pathName = '/shared-list/' + this.list.id;
      text = 'Check out my list, ' + this.list.name + ':';
    }

    switch (socialType) {
      case 'Facebook':
        this.socialMediaService.facebookShare(pathName, text);
        break;

      case 'Twitter':
        this.socialMediaService.twitterShare(pathName, text);
        break;

      case 'Link':
        let copyText: any = document.getElementById("copy");

        copyText.value = location.origin + pathName;
        copyText.select();
        navigator.clipboard.writeText(copyText.value);

        this.fade();
        this.OpenSuccessPrompt();
    }
  }



  async OpenSuccessPrompt() {
    document.removeEventListener("keydown", this.keyDown);
    this.spinnerService.show = true;
    const { SuccessPromptComponent } = await import('../success-prompt/success-prompt.component');
    const { SuccessPromptModule } = await import('../success-prompt/success-prompt.module');

    this.lazyLoadingService.getComponentAsync(SuccessPromptComponent, SuccessPromptModule, this.lazyLoadingService.container)
      .then((successPrompt: SuccessPromptComponent) => {
        successPrompt.header = 'Link Coppied';
        successPrompt.message = 'The link has been copied to the clipboard.';
        successPrompt.shareListForm = this;
        this.spinnerService.show = false;
      });
  }


  close() {
    super.close();
    if (this.manageCollaboratorsForm) this.manageCollaboratorsForm.close();
  }
}