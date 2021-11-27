import { KeyValue, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { List } from '../../classes/list';
import { Product } from '../../classes/product';
import { CreateListFormComponent } from '../../components/create-list-form/create-list-form.component';
import { ListsSideMenuComponent } from '../../components/lists-side-menu/lists-side-menu.component';
import { MoveItemPromptComponent } from '../../components/move-item-prompt/move-item-prompt.component';
import { RemoveItemPromptComponent } from '../../components/remove-item-prompt/remove-item-prompt.component';
import { AccountService } from '../../services/account/account.service';
import { DataService } from '../../services/data/data.service';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';

@Component({
  selector: 'lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss']
})
export class ListsComponent implements OnInit {
  public lists!: Array<List>;
  public selectedList!: List;
  public products!: Array<Product> | undefined;

  public sortOptions: Array<KeyValue<string, string>> = [
    { key: 'Sort by Date Added', value: 'date' },
    { key: 'Sort by Price: Low to High', value: 'price-asc' },
    { key: 'Sort by Price: High to Low', value: 'price-desc' },
    { key: 'Sort by Highest Rating', value: 'rating' },
    { key: 'Sort by Title', value: 'title' }
  ];


  public moveToList: Array<KeyValue<string, string>> = [];

  constructor(
    public accountService: AccountService,
    private lazyLoadingService: LazyLoadingService,
    public dataService: DataService,
    public route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) { }




  ngOnInit() {
    // Get the lists
    this.dataService.get<Array<List>>('api/Lists/', undefined, this.accountService.getHeaders())
      .subscribe((lists: Array<List>) => {
        this.lists = lists;

        combineLatest([this.route.params,
        this.route.queryParams], (params, queryParams) => ({
          ...params, ...queryParams
        })).subscribe(routeParams => {
          if (routeParams.listId == this.route.snapshot.paramMap.get('listId')) {

            // Get the listid from the url
            const listId = this.route.snapshot.paramMap.get('listId');

            if (listId) {
              this.selectedList = lists.find(x => x.id == listId) as List;
            }


            if (!this.selectedList && listId) {
              this.router.navigate(['**'], { skipLocationChange: true });
              return;
            }

            if (this.selectedList) {
              this.dataService
                .get<Array<Product>>('api/Lists/Products', [
                  { key: 'listId', value: this.selectedList.id },
                  { key: 'sort', value: routeParams.sort ? routeParams.sort : '' }
                ], this.accountService.getHeaders()).subscribe((products: Array<Product>) => {
                  this.products = products;
                });
            }

          }
        });
        this.populateMoveToList();
      });
  }







  async onHamburgerButtonClick() {
    const { ListsSideMenuComponent } = await import('../../components/lists-side-menu/lists-side-menu.component');
    const { ListsSideMenuModule } = await import('../../components/lists-side-menu/lists-side-menu.module');

    this.lazyLoadingService.getComponentAsync(ListsSideMenuComponent, ListsSideMenuModule, this.lazyLoadingService.container)
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


  async onRemoveItemClick(product: Product) {
    const { RemoveItemPromptComponent } = await import('../../components/remove-item-prompt/remove-item-prompt.component');
    const { RemoveItemPromptModule } = await import('../../components/remove-item-prompt/remove-item-prompt.module');

    this.lazyLoadingService.getComponentAsync(RemoveItemPromptComponent, RemoveItemPromptModule, this.lazyLoadingService.container)
      .then((removeItemPromptComponent: RemoveItemPromptComponent) => {
        removeItemPromptComponent.list = this.selectedList;
        removeItemPromptComponent.product = product;
        removeItemPromptComponent.onRemove.subscribe(() => {
          this.products?.splice(this.products.indexOf(product), 1);
        });
      });
  }


  async onCreateNewListClick() {
    const { CreateListFormComponent } = await import('../../components/create-list-form/create-list-form.component');
    const { CreateListFormModule } = await import('../../components/create-list-form/create-list-form.module');

    this.lazyLoadingService.getComponentAsync(CreateListFormComponent, CreateListFormModule, this.lazyLoadingService.container)
      .then((createListForm: CreateListFormComponent) => {
        createListForm.onListCreated.subscribe((list: List) => {
          this.lists.unshift(list);
          this.selectedList = list;
          this.populateMoveToList();
          this.products = [];
          this.location.replaceState("/account/lists/" + list.id);
        });
      });
  }


  populateMoveToList() {
    this.moveToList = [];
    this.lists.forEach(x => {
      if (x != this.selectedList) this.moveToList.push({ key: x.name, value: x.id });
    })
  }


  async onMoveItem(toListKeyValue: KeyValue<any, any>, product: Product) {
    const { MoveItemPromptComponent } = await import('../../components/move-item-prompt/move-item-prompt.component');
    const { MoveItemPromptModule } = await import('../../components/move-item-prompt/move-item-prompt.module');

    this.lazyLoadingService.getComponentAsync(MoveItemPromptComponent, MoveItemPromptModule, this.lazyLoadingService.container)
      .then((moveItemPrompt: MoveItemPromptComponent) => {
        moveItemPrompt.product = product;
        moveItemPrompt.fromList = this.selectedList;
        moveItemPrompt.toList = toListKeyValue;
        moveItemPrompt.onMove.subscribe(() => {
          this.products?.splice(this.products.indexOf(product), 1);
          this.selectedList.totalItems--;
          const toList = this.lists.find(x => x.id == toListKeyValue.value) as List;
          toList.totalItems++;
        })
      })
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
}