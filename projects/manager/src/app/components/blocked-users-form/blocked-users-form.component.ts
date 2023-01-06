import { Component, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DataService, LazyLoad, LazyLoadingService } from 'common';
import { BlockedUserItem } from '../../classes/blocked-user-item';
import { ListUpdateType, MenuOptionType } from '../../classes/enums';
import { ListOptions } from '../../classes/list-options';
import { ListUpdate } from '../../classes/list-update';
import { ListComponent } from '../lists/list/list.component';

@Component({
  templateUrl: './blocked-users-form.component.html',
  styleUrls: ['./blocked-users-form.component.scss']
})
export class BlockedUsersFormComponent extends LazyLoad {
  public listOptions: ListOptions = new ListOptions();
  public blockedUsers: Array<BlockedUserItem> = new Array<BlockedUserItem>();
  @ViewChild('listComponent') listComponent!: ListComponent;


  constructor(lazyLoadingService: LazyLoadingService, private dataService: DataService, private sanitizer: DomSanitizer) {
    super(lazyLoadingService);
  }

  ngOnInit(): void {
    super.ngOnInit();

    // Define the list options
    this.listOptions = {
      multiselectable: false,

      deletePrompt: {
        parentObj: this,
        title: 'Unblock',
        primaryButton: {
          name: 'Unblock',
          buttonFunction: this.unblockUser
        },
        secondaryButton: {
          name: 'Cancel'
        }
      },

      menu: {
        parentObj: this,
        menuOptions: [
          {
            type: MenuOptionType.MenuItem,
            name: 'Unblock',
            optionFunction: this.unblockUser
          }
        ]
      }
    }

    // Get all the blcoked users

    // *** WARNING ***

    // DataService path will be changed to 'api/Users/BlockedUsers'

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
    // Define the delete prompt message
    if (listUpdate.type == ListUpdateType.DeletePrompt) {
      this.listOptions.deletePrompt!.message = this.sanitizer.bypassSecurityTrustHtml(
        'The user' +
        ' <span style="color: #ffba00">\"' + listUpdate.deletedItems![0].name + '\"</span>' +
        ' will be unblocked from sending notifications and removed from this list.');
    }

    // When a blocked user is removed from the list
    if (listUpdate.type == ListUpdateType.Delete) {
      const blockedUser = this.blockedUsers.find(x => x.id == listUpdate.deletedItems![0].id);

      // If the user has an account
      if (blockedUser!.userId.length > 0) {

        this.dataService.put('api/Notifications/BlockNotificationSending', {
          userId: blockedUser!.userId
        }).subscribe();

        // Or if the user is a non-account user
      } else {

        this.dataService.delete('api/Notifications/UnblockNonAccountEmail', {
          blockedEmail: blockedUser!.email
        }).subscribe();
      }
    }
  }



  unblockUser() {
    this.listComponent.delete();
  }


  onEscape(): void {
    if (this.listComponent.listManager.selectedItem == null) super.onEscape();
  }
}