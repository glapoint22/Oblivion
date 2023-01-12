import { Component, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DataService, LazyLoad, LazyLoadingService, SpinnerAction } from 'common';
import { BlockedUserItem } from '../../classes/blocked-user-item';
import { ListUpdateType, MenuOptionType } from '../../classes/enums';
import { ListOptions } from '../../classes/list-options';
import { ListUpdate } from '../../classes/list-update';
import { ListComponent } from '../lists/list/list.component';
import { PromptComponent } from '../prompt/prompt.component';

@Component({
  templateUrl: './blocked-users-form.component.html',
  styleUrls: ['./blocked-users-form.component.scss']
})
export class BlockedUsersFormComponent extends LazyLoad {
  private selectedBlockedUser!: BlockedUserItem;

  public listOptions: ListOptions = new ListOptions();
  public blockedUsers: Array<BlockedUserItem> = new Array<BlockedUserItem>();
  @ViewChild('listComponent') listComponent!: ListComponent;


  constructor(lazyLoadingService: LazyLoadingService, private dataService: DataService, private sanitizer: DomSanitizer) {
    super(lazyLoadingService);
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.listOptions = {
      multiselectable: false,
      deletable: false,
      menu: {
        parentObj: this,
        menuOptions: [
          {
            type: MenuOptionType.MenuItem,
            name: 'Unblock User',
            optionFunction: this.openPrompt
          }
        ]
      }
    }

    this.dataService.get<Array<BlockedUserItem>>('api/Notifications/BlockedUsers', undefined, {
      authorization: true
    }).subscribe((blockedUserItems: Array<BlockedUserItem>) => {
      blockedUserItems.forEach((x, index) => this.blockedUsers.push({
        id: index,
        userId: x.userId,
        email: x.email,
        name: x.name
      }))
    });
  }





  onListUpdate(listUpdate: ListUpdate) {
    if (listUpdate.type == ListUpdateType.SelectedItems) {
      this.selectedBlockedUser = listUpdate.selectedItems![0] as BlockedUserItem;
    }
  }



  openPrompt() {
    this.lazyLoadingService.load(async () => {
      const { PromptComponent } = await import('../prompt/prompt.component');
      const { PromptModule } = await import('../prompt/prompt.module');

      return {
        component: PromptComponent,
        module: PromptModule
      }
    }, SpinnerAction.None).then((prompt: PromptComponent) => {
      this.listComponent.listManager.promptOpen = true;
      prompt.parentObj = this;
      prompt.title = 'Unblock User';
      prompt.message = this.sanitizer.bypassSecurityTrustHtml(
        'The user' +
        ' <span style="color: #ffba00">\"' + this.selectedBlockedUser.name + '\"</span>' +
        ' will no longer be blocked from sending notifications.');;
      prompt.primaryButton = {
        name: 'Unblock',
        buttonFunction: this.unblockUser
      }
      prompt.secondaryButton.name = 'Cancel'

      const promptCloseListener = prompt.onClose.subscribe(() => {
        promptCloseListener.unsubscribe();
        this.listComponent.listManager.promptOpen = false;
      })
    })
  }


  unblockUser() {
    // If the user has an account
    if (this.selectedBlockedUser.userId.length > 0) {

      this.dataService.put('api/Notifications/BlockUnblockUser', {
        userId: this.selectedBlockedUser.userId
      }, {
        authorization: true
      }).subscribe();

      // Or if the user is a non-account user
    } else {

      this.dataService.delete('api/Notifications/UnblockNonAccountUser', {
        blockedUserEmail: this.selectedBlockedUser.email
      }, {
        authorization: true
      }).subscribe();
    }

    this.listComponent.listManager.delete();
  }


  onEscape(): void {
    if (this.listComponent.listManager.selectedItem == null) super.onEscape();
  }
}