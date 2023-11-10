import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService, DropdownType, LazyLoadingService, SpinnerAction } from 'common';
import { List } from '../../classes/list';
import { ListProduct } from '../../classes/list-product';
import { ListsComponent } from '../lists/lists.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'shared-list',
  templateUrl: './shared-list.component.html',
  styleUrls: ['../lists/lists.component.scss']
})
export class SharedListComponent extends ListsComponent implements OnInit {
  public DropdownType = DropdownType;
  private dataServiceGet3Subscription!: Subscription;
  private routeParentData2Subscription!: Subscription;

  constructor(
    lazyLoadingService: LazyLoadingService,
    dataService: DataService,
    route: ActivatedRoute,
    public router: Router,
    location: Location
  ) { super(lazyLoadingService, dataService, route, router, location) }

  ngOnInit() {
    this.routeParentData2Subscription = this.route.parent!.data.subscribe(data => {
      this.products = data.sharedList.products;
      this.selectedList = new List(data.sharedList.listId, data.sharedList.name);
    });
  }


  onSortChange(value: string) {
    this.router.navigate([], {
      queryParams: { sort: value },
      queryParamsHandling: 'merge'
    });

    window.setTimeout(() => {
      this.dataServiceGet3Subscription = this.dataService.get<Array<ListProduct>>('api/Lists/GetSharedListProducts', [
        {
          key: 'listId',
          value: this.selectedList.id
        },
        {
          key: 'sort',
          value: value
        }
      ], {
        spinnerAction: SpinnerAction.StartEnd
      }).subscribe((products: Array<ListProduct>) => {
        this.products = products;
      });
    });

  }



  ngOnDestroy() {
    super.ngOnDestroy();
    if (this.dataServiceGet3Subscription) this.dataServiceGet3Subscription.unsubscribe();
    if (this.routeParentData2Subscription) this.routeParentData2Subscription.unsubscribe();
  }
}