import { KeyValue, Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService, DropdownType, LazyLoadingService, SpinnerAction } from 'common';
import { List } from '../../classes/list';
import { ListProduct } from '../../classes/list-product';
import { CreateListFormComponent } from '../../components/create-list-form/create-list-form.component';
import { ListsMenuComponent } from '../../components/lists-menu/lists-menu.component';
import { ListsSideMenuComponent } from '../../components/lists-side-menu/lists-side-menu.component';
import { MoveItemPromptComponent } from '../../components/move-item-prompt/move-item-prompt.component';
import { RemoveItemPromptComponent } from '../../components/remove-item-prompt/remove-item-prompt.component';
import { Breadcrumb } from '../../classes/breadcrumb';
import { Subscription } from 'rxjs';
import { SocialMediaService } from '../../services/social-media/social-media.service';

@Component({
  selector: 'lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss']
})
export class ListsComponent implements OnInit {
  private indexOfSelectedList!: number;
  private listsSideMenu!: ListsSideMenuComponent;

  public lists!: Array<List>;
  public selectedList!: List;
  public products!: Array<ListProduct> | undefined;
  public DropdownType = DropdownType;
  public window = window;
  public breadcrumbs!: Array<Breadcrumb>;

  @ViewChild('purpleButton') purpleButton!: ElementRef<HTMLElement>;
  @ViewChild('listMenuContainer') listMenuContainer!: ElementRef<HTMLElement>;
  @ViewChild('listMenu') listMenu!: ListsMenuComponent;

  public sortOptions: Array<KeyValue<string, string>> = [
    { key: 'Sort by Date Added', value: 'date' },
    { key: 'Sort by Price: Low to High', value: 'price-asc' },
    { key: 'Sort by Price: High to Low', value: 'price-desc' },
    { key: 'Sort by Highest Rating', value: 'rating' },
    { key: 'Sort by Title', value: 'title' }
  ];

  public moveToList: Array<KeyValue<string, string>> = [];
  private routeParentDataSubscription!: Subscription;
  private dataServiceGet1Subscription!: Subscription;
  private dataServiceGet2Subscription!: Subscription;

  constructor(
    public lazyLoadingService: LazyLoadingService,
    public dataService: DataService,
    public route: ActivatedRoute,
    public router: Router,
    private location: Location,
    protected socialMediaService: SocialMediaService
  ) { }



  ngOnInit() {
    this.routeParentDataSubscription = this.route.parent!.data.subscribe(results => {
      if (results.listData) {
        this.lists = results.listData.lists;
        this.products = results.listData.products;
        this.selectedList = results.listData.selectedList;
        this.indexOfSelectedList = this.lists.indexOf(this.selectedList)
        this.populateMoveToList();
        window.addEventListener("keydown", this.keyDown);
      } else {
        this.lists = [];
      }
    });

    // Set the breadcrumbs
    this.breadcrumbs = [
      {
        link: {
          name: 'Your Account',
          route: '/account'
        }
      },
      {
        active: 'Your Lists'
      }
    ]

    this.socialMediaService.addMetaTags('Your LIsts');
  }


  ngAfterViewInit() {
    this.setStylingValues();
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
        this.listsSideMenu = listsSideMenu;
        listsSideMenu.lists = this.lists;
        listsSideMenu.selectedList = this.selectedList;

        const listsSideMenuOnListClickSubscription = listsSideMenu.onListClick
          .subscribe((list: List) => {
            listsSideMenuOnListClickSubscription.unsubscribe();
            this.onListClick(list);
          });

        const listsSideMenuOnCreateNewListClickSubscription = listsSideMenu.onCreateNewListClick
          .subscribe(() => {
            listsSideMenuOnCreateNewListClickSubscription.unsubscribe();
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
        const removeItemPromptComponentOnRemoveSubscription = removeItemPromptComponent.onRemove.subscribe(() => {
          removeItemPromptComponentOnRemoveSubscription.unsubscribe();
          this.products?.splice(this.products.indexOf(product), 1);
          this.selectedList.totalProducts--;
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
        const createListFormOnListCreatedSubscription = createListForm.onListCreated.subscribe((list: List) => {
          createListFormOnListCreatedSubscription.unsubscribe();
          this.lists.push(list);
          this.selectedList = list;
          this.populateMoveToList();
          this.products = [];
          this.location.replaceState('/account/lists/' + list.id);
          this.setStylingValues();
          if (this.listsSideMenu) this.listsSideMenu.setSelectedList(list);
        });
      });
  }


  populateMoveToList() {
    this.moveToList = [];
    this.lists.forEach(x => {
      if (x != this.selectedList &&
        (this.selectedList.isOwner || this.selectedList.listPermissions.canRemoveFromList) &&
        (x.isOwner || x.listPermissions.canAddToList)) {
        this.moveToList.push({ key: x.name, value: x.id });
      }
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
        const moveItemPromptOnMoveSubscription = moveItemPrompt.onMove.subscribe(() => {
          moveItemPromptOnMoveSubscription.unsubscribe();
          this.products?.splice(this.products.indexOf(product), 1);
          this.selectedList.totalProducts--;
          const toList = this.lists.find(x => x.id == toListKeyValue.value) as List;
          toList.totalProducts++;
        });
      });
  }


  onListClick(list: List) {
    if (list == this.selectedList) return;
    this.selectedList = list;
    this.indexOfSelectedList = this.lists.indexOf(this.selectedList)


    // This will clear any query params
    this.router.navigate([], {
      queryParams: { sort: null },
      queryParamsHandling: 'merge'
    });

    window.setTimeout(() => {
      this.location.replaceState('/account/lists/' + list.id);
      this.dataServiceGet1Subscription = this.dataService.get<Array<ListProduct>>('api/Lists/GetListProducts', [
        {
          key: 'listId',
          value: list.id
        }
      ], {
        authorization: true,
        spinnerAction: SpinnerAction.StartEnd
      })
        .subscribe((products: Array<ListProduct>) => {
          this.populateMoveToList();
          this.products = products;
        });
    });
  }


  onSortChange(value: string) {
    this.router.navigate([], {
      queryParams: { sort: value },
      queryParamsHandling: 'merge'
    });

    window.setTimeout(() => {
      this.dataServiceGet2Subscription = this.dataService.get<Array<ListProduct>>('api/Lists/GetListProducts', [
        {
          key: 'listId',
          value: this.selectedList.id
        },
        {
          key: 'sort',
          value: value
        }
      ], {
        authorization: true,
        spinnerAction: SpinnerAction.StartEnd
      }).subscribe((products: Array<ListProduct>) => {
        this.products = products;
      });
    });

  }




  onVisitOfficalWebsiteClick(hoplink: string) {
    window.open(hoplink, '_blank');
  }


  onProductClick(product: ListProduct) {
    this.router.navigate([product.urlName, product.id]);
  }


  getDate(date: string) {
    return new Date(date + 'Z');
  }


  setStylingValues() {
    window.setTimeout(() => {
      if (this.purpleButton) {
        this.purpleButton.nativeElement.style.maxWidth = this.listMenuContainer.nativeElement.scrollHeight > this.listMenuContainer.nativeElement.clientHeight ? '215px' : '240px';
      }

      if(this.listMenuContainer) {
        this.listMenuContainer.nativeElement.style.paddingRight = this.listMenuContainer.nativeElement.scrollHeight > this.listMenuContainer.nativeElement.clientHeight ? '10px' : '0';
      }
    })
  }






  keyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.onArrow(-1);
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.onArrow(1);
    }
  }


  onArrow(direction: number) {

    if(this.lists.length === 0) return;

    if (this.listMenu.HtmlLists.some(x => x.nativeElement == document.activeElement || this.listMenuContainer.nativeElement == document.activeElement)) {
      // Increment or decrement the index (depending on direction)
      this.indexOfSelectedList = this.indexOfSelectedList + direction;

      // If the index increments past the end of the list or decrements beyond the begining of the list, then loop back around
      if (this.indexOfSelectedList == (direction == 1 ? this.lists.length : -1)) this.indexOfSelectedList = direction == 1 ? 0 : this.lists.length - 1;

      this.onListClick(this.lists[this.indexOfSelectedList]);
    }
  }



  ngOnDestroy() {
    if (this.routeParentDataSubscription) this.routeParentDataSubscription.unsubscribe();
    if (this.dataServiceGet1Subscription) this.dataServiceGet1Subscription.unsubscribe();
    if (this.dataServiceGet2Subscription) this.dataServiceGet2Subscription.unsubscribe();
  }
}