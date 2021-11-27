import { Component } from '@angular/core';
import { ShareListType } from '../../classes/enums';
import { LazyLoad } from '../../classes/lazy-load';
import { List } from '../../classes/list';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';
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

  constructor(private lazyLoadingService: LazyLoadingService){
    super();
  }

  onShareClick(socialType: string) {
    let pathName: string;
    let text: string;
    const collaborateInput = document.getElementById('collaborate') as HTMLInputElement;

    if (this.shareListType == ShareListType.Collaborate || (this.shareListType == ShareListType.Both && collaborateInput.checked)) {
      pathName = '/collaborate-list/' + this.list.collaborateId;
      text = 'You\'re invited to help me with my list at NicheShack.com!';
    } else {
      pathName = '/shared-list/' + this.list.id;
      text = 'Check out my list at NicheShack.com!';
    }

    switch (socialType) {
      case 'Facebook':
        this.onFacebookClick(pathName, text);
        break;

      case 'Twitter':
        this.onTwitterClick(pathName, text);
        break;

      case 'Link':
        let copyText: any = document.getElementById("copy");

        copyText.value = location.origin + pathName;
        copyText.select();
        navigator.clipboard.writeText(copyText.value);

        this.OpenSuccessPrompt();
    }
  }


  onFacebookClick(url: string, quote?: string) {
    // window['FB'].ui({
    //   method: 'share',
    //   href: location.origin + url,
    //   quote: quote
    // });
  }

  onTwitterClick(url: string, text: string) {
    this.openWindow('https://twitter.com/intent/tweet?text=' + text + '&url=' + location.origin + url);
  }

  onPinterestClick(url: string, image: string, description: string) {
    this.openWindow('https://www.pinterest.com/pin/create/button/?url=' + location.origin + url
      + '&media=' + location.origin + '/images/' + image
      + '&description=' + description)
  }

  openWindow(url: string) {
    let width: number = 580;
    let height: number = 360;
    let horizontalCenter = (window.innerWidth - width) / 2;
    let verticalCenter = (window.innerHeight - height) / 2;

    window.open(url, '_blank', 'toolbar=yes,scrollbars=no,resizable=yes,top=' +
      verticalCenter + ',left=' + horizontalCenter + ',width=' + width + ',height=' + height);
  }


  async OpenSuccessPrompt() {
    const { SuccessPromptComponent } = await import('../success-prompt/success-prompt.component');
    const { SuccessPromptModule } = await import('../success-prompt/success-prompt.module');

    this.lazyLoadingService.getComponentAsync(SuccessPromptComponent, SuccessPromptModule, this.lazyLoadingService.container)
    .then((successPromptComponent: SuccessPromptComponent)=> {
      successPromptComponent.header = 'Link Coppied';
      successPromptComponent.message = 'The link has been copied to the clipboard.';
    });
  }
}