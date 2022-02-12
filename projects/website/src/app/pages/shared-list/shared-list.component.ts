import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService, LazyLoadingService } from 'common';
import { List } from '../../classes/list';
import { ListIdResolver } from '../../resolvers/list-id/list-id.resolver';
import { ListsComponent } from '../lists/lists.component';

@Component({
  selector: 'shared-list',
  templateUrl: './shared-list.component.html',
  styleUrls: ['../lists/lists.component.scss']
})
export class SharedListComponent extends ListsComponent implements OnInit {

  constructor(
    lazyLoadingService: LazyLoadingService,
    dataService: DataService,
    route: ActivatedRoute,
    router: Router,
    listIdResolver: ListIdResolver
  ) { super(lazyLoadingService, dataService, route, router, listIdResolver) }

  ngOnInit() {
    this.route.parent?.data.subscribe(data => {
      this.products = data.sharedList.products;
      this.selectedList = new List(data.sharedList.id, data.sharedList.name);
    });
  }
}