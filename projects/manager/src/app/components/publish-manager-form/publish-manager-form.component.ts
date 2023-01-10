import { Component } from '@angular/core';
import { DataService, LazyLoad, LazyLoadingService } from 'common';
import { BuilderType, ListUpdateType } from '../../classes/enums';
import { ListUpdate } from '../../classes/list-update';
import { PublishItem } from '../../classes/publish-item';
import { ProductService } from '../../services/product/product.service';

@Component({
  templateUrl: './publish-manager-form.component.html',
  styleUrls: ['./publish-manager-form.component.scss']
})
export class PublishManagerFormComponent extends LazyLoad {
  public publishItems: Array<PublishItem> = new Array<PublishItem>();

  constructor(lazyLoadingService: LazyLoadingService, private dataService: DataService, private productService: ProductService) {
    super(lazyLoadingService);
  }

  onOpen() {
    this.dataService.get<Array<PublishItem>>('api/PublishItems/GetPublishItems').subscribe((publishItems: Array<PublishItem>) => {
      publishItems.forEach(x => {
        this.publishItems.push(x);
      })
    });
  }


  onListUpdate(listUpdate: ListUpdate) {
    if (listUpdate.type == ListUpdateType.SelectedItems) {

      switch ((listUpdate.selectedItems![0] as PublishItem).publishType) {
        case BuilderType.Product:
          this.productService.goToProduct((listUpdate.selectedItems![0] as PublishItem).productId);
          break;

        case BuilderType.Page:
          console.log('go to page')
          break;

        case BuilderType.Email:
          console.log('go to email')
          break;
      }
      this.close();
    }
  }
}