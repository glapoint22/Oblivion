import { Component } from '@angular/core';
import { DataService, LazyLoad, LazyLoadingService } from 'common';
import { MultiColumnItem } from '../../classes/multi-column-item';
import { NoncompliantUserItem } from '../../classes/noncompliant-user-Item';

@Component({
  templateUrl: './noncompliant-users-form.component.html',
  styleUrls: ['./noncompliant-users-form.component.scss']
})
export class NoncompliantUsersFormComponent extends LazyLoad {
  public nonCompliantUsers: Array<MultiColumnItem> = new Array<MultiColumnItem>();

  constructor(lazyLoadingService: LazyLoadingService, private dataService: DataService) {
    super(lazyLoadingService);
  }

  ngOnInit(): void {
    // Get all the noncompliant users


    // *** WARNING ***

    // DataService path will be changed to 'api/Users/NoncompliantUsers'


    this.dataService.get<Array<NoncompliantUserItem>>('api/Notifications/NoncompliantUsers', undefined, {
      authorization: true
    }).subscribe((blockedUserItems: Array<NoncompliantUserItem>) => {
      blockedUserItems.forEach((x, index) => {
        this.nonCompliantUsers.push({
          id: index,
          name: null!,
          values: [{ name: x.name!, width: '300px' }, { name: x.strikes, width: x.strikes.length == 1 ? '20px' : x.strikes.length == 2 ? '29px' : '39px' }]
        })
      })
    });
  }
}