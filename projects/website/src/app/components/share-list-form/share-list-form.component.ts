import { Component } from '@angular/core';
import { ShareListType, SpinnerAction } from '../../classes/enums';
import { LazyLoad } from '../../classes/lazy-load';
import { List } from '../../classes/list';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';
import { SocialMediaService } from '../../services/social-media/social-media.service';
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

  constructor
    (
      lazyLoadingService: LazyLoadingService,
      private socialMediaService: SocialMediaService
    ) { super(lazyLoadingService) }


  ngAfterViewInit(): void {
    super.ngAfterViewInit();

    if (this.shareListType == ShareListType.Both) {
      if (this.tabElements) this.tabElements[0].nativeElement.focus();
    } else {
      this.base.nativeElement.focus();
    }
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
        this.OpenSuccessPrompt();
    }
  }



  async OpenSuccessPrompt() {
    this.fade();

    this.lazyLoadingService.load(async () => {
      const { SuccessPromptComponent } = await import('../success-prompt/success-prompt.component');
      const { SuccessPromptModule } = await import('../success-prompt/success-prompt.module');

      return {
        component: SuccessPromptComponent,
        module: SuccessPromptModule
      }
    }, SpinnerAction.StartEnd)
      .then((successPrompt: SuccessPromptComponent) => {
        successPrompt.header = 'Link Coppied';
        successPrompt.message = 'The link has been copied to the clipboard.';
      });
  }


  onSpace(e: KeyboardEvent): void {
    e.preventDefault();

    if (this.tabElements) {
      if (this.shareListType == ShareListType.Both) {
        if (this.tabElements[0].nativeElement == document.activeElement) (this.tabElements[0].nativeElement.previousElementSibling as HTMLInputElement).checked = true;
        if (this.tabElements[1].nativeElement == document.activeElement) (this.tabElements[1].nativeElement.previousElementSibling as HTMLInputElement).checked = true;
      }
    }
  }


  onEnter(e: KeyboardEvent): void {
    if (this.tabElements) {
      if (this.shareListType == ShareListType.Both) {
        if (this.tabElements[0].nativeElement == document.activeElement) (this.tabElements[0].nativeElement.previousElementSibling as HTMLInputElement).checked = true;
        if (this.tabElements[1].nativeElement == document.activeElement) (this.tabElements[1].nativeElement.previousElementSibling as HTMLInputElement).checked = true;
        if (this.tabElements[2].nativeElement == document.activeElement) this.onShareClick('Facebook');
        if (this.tabElements[3].nativeElement == document.activeElement) this.onShareClick('Twitter');
        if (this.tabElements[4].nativeElement == document.activeElement) this.onShareClick('Link');

      } else {

        if (this.tabElements[0].nativeElement == document.activeElement) this.onShareClick('Facebook');
        if (this.tabElements[1].nativeElement == document.activeElement) this.onShareClick('Twitter');
        if (this.tabElements[2].nativeElement == document.activeElement) this.onShareClick('Link');
      }
    }
  }
}