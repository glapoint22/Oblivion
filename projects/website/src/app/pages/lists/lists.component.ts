import { KeyValue } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SpinnerAction } from '../../classes/enums';
import { List } from '../../classes/list';
import { ListProduct } from '../../classes/list-product';
import { CreateListFormComponent } from '../../components/create-list-form/create-list-form.component';
import { ListsSideMenuComponent } from '../../components/lists-side-menu/lists-side-menu.component';
import { MoveItemPromptComponent } from '../../components/move-item-prompt/move-item-prompt.component';
import { RemoveItemPromptComponent } from '../../components/remove-item-prompt/remove-item-prompt.component';
import { ListIdResolver } from '../../resolvers/list-id/list-id.resolver';
import { DataService } from '../../services/data/data.service';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';

@Component({
  selector: 'lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss']
})
export class ListsComponent implements OnInit, OnDestroy {
  public lists!: Array<List>;
  public selectedList!: List;
  public products!: Array<ListProduct> | undefined;

  public sortOptions: Array<KeyValue<string, string>> = [
    { key: 'Sort by Date Added', value: 'date' },
    { key: 'Sort by Price: Low to High', value: 'price-asc' },
    { key: 'Sort by Price: High to Low', value: 'price-desc' },
    { key: 'Sort by Highest Rating', value: 'rating' },
    { key: 'Sort by Title', value: 'title' }
  ];

  public moveToList: Array<KeyValue<string, string>> = [];

  constructor(
    private lazyLoadingService: LazyLoadingService,
    public dataService: DataService,
    public route: ActivatedRoute,
    private router: Router,
    private listIdResolver: ListIdResolver
  ) { }




  ngOnInit() {
    this.route.parent?.data.subscribe(results => {
      if (results.listData) {
        this.lists = results.listData.lists;
        this.products = results.listData.products;
        this.selectedList = results.listData.selectedList;
        this.populateMoveToList();
      } else {
        this.lists = [];
      }
    });
  }


  setSelectedSortOption() {
    const index = Math.max(0, this.sortOptions.findIndex(x => x.value == this.route.snapshot.queryParamMap.get('sort')));
    return this.sortOptions[index];
  }




  async onHamburgerButtonClick() {
    this.lazyLoadingService.load(async () => {
      const { ListsSideMenuComponent } = await import('../../components/lists-side-menu/lists-side-menu.component');
      const { ListsSideMenuModule } = await import('../../components/lists-side-menu/lists-side-menu.module');

      return {
        component: ListsSideMenuComponent,
        module: ListsSideMenuModule
      }
    }, SpinnerAction.StartEnd)
      .then((listsSideMenu: ListsSideMenuComponent) => {
        listsSideMenu.lists = this.lists;
        listsSideMenu.selectedList = this.selectedList;

        listsSideMenu.onListClick
          .subscribe((list: List) => {
            this.onListClick(list);
          });

        listsSideMenu.onCreateNewListClick
          .subscribe(() => {
            this.onCreateNewListClick();
          });
      });
  }


  async onRemoveItemClick(product: ListProduct) {
    this.lazyLoadingService.load(async () => {
      const { RemoveItemPromptComponent } = await import('../../components/remove-item-prompt/remove-item-prompt.component');
      const { RemoveItemPromptModule } = await import('../../components/remove-item-prompt/remove-item-prompt.module');

      return {
        component: RemoveItemPromptComponent,
        module: RemoveItemPromptModule
      }
    }, SpinnerAction.StartEnd)
      .then((removeItemPromptComponent: RemoveItemPromptComponent) => {
        removeItemPromptComponent.list = this.selectedList;
        removeItemPromptComponent.product = product;
        removeItemPromptComponent.onRemove.subscribe(() => {
          this.products?.splice(this.products.indexOf(product), 1);
        });
      });
  }


  async onCreateNewListClick() {
    this.lazyLoadingService.load(async () => {
      const { CreateListFormComponent } = await import('../../components/create-list-form/create-list-form.component');
      const { CreateListFormModule } = await import('../../components/create-list-form/create-list-form.module');

      return {
        component: CreateListFormComponent,
        module: CreateListFormModule
      }
    }, SpinnerAction.StartEnd)
      .then((createListForm: CreateListFormComponent) => {
        createListForm.onListCreated.subscribe((list: List) => {
          this.lists.push(list);
          this.selectedList = list;
          this.populateMoveToList();
          this.products = [];
          this.router.navigateByUrl('/account/lists/' + list.id);
        });
      });
  }


  populateMoveToList() {
    this.moveToList = [];
    this.lists.forEach(x => {
      if (x != this.selectedList) this.moveToList.push({ key: x.name, value: x.id });
    })
  }


  async onMoveItem(toListKeyValue: KeyValue<any, any>, product: ListProduct) {
    this.lazyLoadingService.load(async () => {
      const { MoveItemPromptComponent } = await import('../../components/move-item-prompt/move-item-prompt.component');
      const { MoveItemPromptModule } = await import('../../components/move-item-prompt/move-item-prompt.module');

      return {
        component: MoveItemPromptComponent,
        module: MoveItemPromptModule
      }
    }, SpinnerAction.StartEnd)
      .then((moveItemPrompt: MoveItemPromptComponent) => {
        moveItemPrompt.product = product;
        moveItemPrompt.fromList = this.selectedList;
        moveItemPrompt.toList = toListKeyValue;
        moveItemPrompt.onMove.subscribe(() => {
          this.products?.splice(this.products.indexOf(product), 1);
          this.selectedList.totalItems--;
          const toList = this.lists.find(x => x.id == toListKeyValue.value) as List;
          toList.totalItems++;
        });
      });
  }


  onListClick(list: List) {
    if (list == this.selectedList) return;
    this.selectedList = list;
    this.router.navigate(['account/lists', list.id]);
    this.populateMoveToList();
    this.products = undefined;
  }


  onSortChange(value: string) {
    this.router.navigate([], {
      queryParams: { sort: value },
      queryParamsHandling: 'merge'
    });
  }


  onVisitOfficalWebsiteClick(hoplink: string) {
    window.open(hoplink, '_blank');
  }


  onProductClick(product: ListProduct) {
    this.router.navigate([product.urlName, product.urlId]);
  }


  ngOnDestroy(): void {
    this.listIdResolver.lists = null;
  }
}