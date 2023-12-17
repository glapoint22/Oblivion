import { Component, ElementRef, ViewChild, ViewContainerRef } from '@angular/core';
import { LazyLoadingService, RadioButtonLazyLoad, SpinnerAction } from 'common';
import { ShareListType } from '../../classes/enums';
import { List } from '../../classes/list';
import { SocialMediaService } from '../../services/social-media/social-media.service';
import { CopiedPopupComponent } from '../copied-popup/copied-popup.component';

@Component({
  selector: 'share-list-form',
  templateUrl: './share-list-form.component.html',
  styleUrls: ['./share-list-form.component.scss']
})
export class ShareListFormComponent extends RadioButtonLazyLoad {
  public shareListType!: ShareListType;
  public ShareListType = ShareListType;
  public list!: List;
  public linkCopied!: boolean;
  @ViewChild('copiedPopupContainer', { read: ViewContainerRef }) copiedPopupContainer!: ViewContainerRef;

  constructor
    (
      lazyLoadingService: LazyLoadingService,
      private socialMediaService: SocialMediaService
    ) { super(lazyLoadingService) }


  ngAfterViewInit(): void {
    super.ngAfterViewInit();

    if (this.shareListType == ShareListType.Both) {
      this.setFocus(0);
    } else {
      this.base.nativeElement.focus();
    }
  }


  onShareClick(socialType: string) {
    let pathName: string;
    let text: string;
    const collaborateInput = document.getElementById('collaborate') as HTMLInputElement;

    this.linkCopied = false;

    if (this.shareListType == ShareListType.Collaborate || (this.shareListType == ShareListType.Both && collaborateInput.checked)) {
      pathName = '/collaborate-list/' + this.list.collaborateId;
      text = 'You\'re invited to collaborate on list, ' + this.list.name + ':';
    } else {
      pathName = '/shared-list/' + this.list.id;
      text = 'Check out my list, ' + this.list.name + ':';
    }

    switch (socialType) {
      // case 'Facebook':
      //   this.socialMediaService.facebookShare(pathName, text);
      //   break;

      case 'Twitter':
        this.socialMediaService.twitterShare(pathName, text);
        break;

      case 'Link':
        let copyText: any = document.getElementById("copy");

        copyText.value = location.origin + pathName;
        copyText.select();
        navigator.clipboard.writeText(copyText.value);
        this.linkCopied = true;
        this.openLinkCopiedPopup();
    }
  }




  openLinkCopiedPopup() {
    this.lazyLoadingService.load(async () => {
      const { CopiedPopupComponent } = await import('../copied-popup/copied-popup.component');
      const { CopiedPopupModule } = await import('../copied-popup/copied-popup.module');

      return {
        component: CopiedPopupComponent,
        module: CopiedPopupModule
      }
    }, SpinnerAction.None, this.copiedPopupContainer)
    .then((copiedPopup: CopiedPopupComponent)=> {
      const copiedPopupOnCloseSubscription = copiedPopup.onClose.subscribe(()=> {
        copiedPopupOnCloseSubscription.unsubscribe();
        this.linkCopied = false;
      })
    })
  }







  onEnter(e: KeyboardEvent): void {
    if (this.tabElements) {
      if (this.shareListType == ShareListType.Both) {
        // if (this.tabElements[2].nativeElement == document.activeElement) this.onShareClick('Facebook');
        if (this.tabElements[3].nativeElement == document.activeElement) this.onShareClick('Twitter');
        if (this.tabElements[4].nativeElement == document.activeElement) this.onShareClick('Link');

      } else {

        // if (this.tabElements[0].nativeElement == document.activeElement) this.onShareClick('Facebook');
        if (this.tabElements[1].nativeElement == document.activeElement) this.onShareClick('Twitter');
        if (this.tabElements[2].nativeElement == document.activeElement) this.onShareClick('Link');
      }
    }
  }


  onRadioButtonChange(radioButton: ElementRef<HTMLElement>) {
    this.linkCopied = false;
  }
}