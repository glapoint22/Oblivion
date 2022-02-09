import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { List } from '../../classes/list';
import { ListIdResolver } from '../../resolvers/list-id/list-id.resolver';
import { DataService } from '../../services/data/data.service';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';
import { SpinnerService } from '../../services/spinner/spinner.service';
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
    spinnerService: SpinnerService,
    listIdResolver: ListIdResolver
  ) { super(lazyLoadingService, dataService, route, router, listIdResolver) }

  ngOnInit() {
    this.route.parent?.data.subscribe(data => {
      this.products = data.sharedList.products;
      this.selectedList = new List(data.sharedList.id, data.sharedList.name);
    });
  }
}