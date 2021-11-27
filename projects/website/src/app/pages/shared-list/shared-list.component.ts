import { Component, OnInit } from '@angular/core';
import { ParamMap } from '@angular/router';
import { List } from '../../classes/list';
import { Product } from '../../classes/product';
import { ListsComponent } from '../lists/lists.component';

@Component({
  selector: 'shared-list',
  templateUrl: './shared-list.component.html',
  styleUrls: ['../lists/lists.component.scss']
})
export class SharedListComponent extends ListsComponent implements OnInit {

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.products = data.sharedList.products;
      this.selectedList = new List(data.sharedList.id, data.sharedList.name);
    });

    this.route.queryParamMap.subscribe((params: ParamMap) => {
      this.dataService
        .get<Array<Product>>('api/Lists/Products', [
          { key: 'listId', value: this.selectedList.id },
          { key: 'sort', value: params.get('sort') ? params.get('sort') : '' }
        ], this.accountService.getHeaders()).subscribe((products: Array<Product>) => {
          this.products = products;
        });
    })
  }
}