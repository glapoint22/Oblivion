import { KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { combineLatest, merge } from 'rxjs';
import { List } from '../../classes/list';
import { Product } from '../../classes/product';
import { EditListFormComponent } from '../../components/edit-list-form/edit-list-form.component';
import { AccountService } from '../../services/account/account.service';
import { DataService } from '../../services/data/data.service';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';

@Component({
  selector: 'lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss']
})
export class ListsComponent implements OnInit {
  public lists: Array<List> = [];
  public selectedList!: List;
  public products: Array<Product> = [];

  public sortOptions: Array<KeyValue<string, string>> = [
    { key: 'Sort by Date Added', value: 'date' },
    { key: 'Sort by Price: Low to High', value: 'price-asc' },
    { key: 'Sort by Price: High to Low', value: 'price-desc' },
    { key: 'Sort by Highest Rating', value: 'rating' },
    { key: 'Sort by Title', value: 'title' }
  ];


  public trumpy: Array<KeyValue<string, string>> = [
    { key: 'Sort by Date Added', value: 'date' },
    { key: 'Sort by Price: Low to High ilosdfjlsd lksdjfklsdlkj sdflksdfjkls oiweroiuwe kljsdf', value: 'price-asc' },
    { key: 'Sort by Price: High to Low', value: 'price-desc' },
    { key: 'Sort by Highest Rating', value: 'rating' },
    { key: 'Sort by Title', value: 'title' }
  ];

  constructor(
    public accountService: AccountService,
    private lazyLoadingService: LazyLoadingService,
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router
  ) { }




  ngOnInit() {

    this.dataService.get<Array<List>>('api/Lists/', undefined, this.accountService.getHeaders())
      .subscribe((lists: Array<List>) => {
        this.lists = lists;
        const listId = this.route.snapshot.paramMap.get('listId');

        if (!listId) {
          this.selectedList = lists[0];
        } else {
          this.selectedList = lists.find(x => x.id == listId) as List;
        }

        if (!this.selectedList) {
          this.router.navigate(['**'], { skipLocationChange: true });
        } else {

          combineLatest([this.route.params,
          this.route.queryParams], (params, queryParams) => ({
            ...params, ...queryParams
          })).subscribe(routeParams => {
            if (routeParams.listId == this.route.snapshot.paramMap.get('listId')) {
              this.dataService
                .get<Array<Product>>('api/Lists/Products', [
                  { key: 'listId', value: this.selectedList.id },
                  { key: 'sort', value: routeParams.sort ? routeParams.sort : '' }
                ], this.accountService.getHeaders()).subscribe((products: Array<Product>) => {
                  this.products = products;
                });
            }
          });
        }
      });
  }



  async onManageCollaboratorsClick() {
    const { ManageCollaboratorsFormComponent } = await import('../../components/manage-collaborators-form/manage-collaborators-form.component');
    const { ManageCollaboratorsFormModule } = await import('../../components/manage-collaborators-form/manage-collaborators-form.module');

    this.lazyLoadingService.getComponentAsync(ManageCollaboratorsFormComponent, ManageCollaboratorsFormModule, this.lazyLoadingService.container);
  }

  async onDeleteListClick() {
    const { DeleteListPromptComponent } = await import('../../components/delete-list-prompt/delete-list-prompt.component');
    const { DeleteListPromptModule } = await import('../../components/delete-list-prompt/delete-list-prompt.module');

    this.lazyLoadingService.getComponentAsync(DeleteListPromptComponent, DeleteListPromptModule, this.lazyLoadingService.container);
  }


  async onEditListClick() {
    const { EditListFormComponent } = await import('../../components/edit-list-form/edit-list-form.component');
    const { EditListFormModule } = await import('../../components/edit-list-form/edit-list-form.module');

    this.lazyLoadingService.getComponentAsync(EditListFormComponent, EditListFormModule, this.lazyLoadingService.container)
      .then((editListFormComponent: EditListFormComponent) => {
        editListFormComponent.list = this.selectedList;

        editListFormComponent.onInit.subscribe(()=> {
          const listName =  editListFormComponent.form.get('listName');
          const description =  editListFormComponent.form.get('description');

          listName?.setValue(this.selectedList.name);
          description?.setValue(this.selectedList.description);
        });
      });
  }


  async onShareListClick() {
    const { ShareListFormComponent } = await import('../../components/share-list-form/share-list-form.component');
    const { ShareListFormModule } = await import('../../components/share-list-form/share-list-form.module');

    this.lazyLoadingService.getComponentAsync(ShareListFormComponent, ShareListFormModule, this.lazyLoadingService.container);
  }

  async onRemoveItemClick() {
    const { RemoveItemPromptComponent } = await import('../../components/remove-item-prompt/remove-item-prompt.component');
    const { RemoveItemPromptModule } = await import('../../components/remove-item-prompt/remove-item-prompt.module');

    this.lazyLoadingService.getComponentAsync(RemoveItemPromptComponent, RemoveItemPromptModule, this.lazyLoadingService.container);
  }


  async onCreateNewListClick() {
    const { CreateListFormComponent } = await import('../../components/create-list-form/create-list-form.component');
    const { CreateListFormModule } = await import('../../components/create-list-form/create-list-form.module');

    this.lazyLoadingService.getComponentAsync(CreateListFormComponent, CreateListFormModule, this.lazyLoadingService.container);
  }


  async onMoveItem() {
    const { MoveItemPromptComponent } = await import('../../components/move-item-prompt/move-item-prompt.component');
    const { MoveItemPromptModule } = await import('../../components/move-item-prompt/move-item-prompt.module');

    this.lazyLoadingService.getComponentAsync(MoveItemPromptComponent, MoveItemPromptModule, this.lazyLoadingService.container);
  }


  onListClick(list: List) {
    this.selectedList = list;
    this.router.navigate(['account/lists', list.id]);
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
