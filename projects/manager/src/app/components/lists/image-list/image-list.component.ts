import { Component, Input } from '@angular/core';
import { ImageItem } from '../../../classes/image-item';
import { ImageListManager } from '../../../classes/image-list-manager';
import { ListComponent } from '../list/list.component';

@Component({
  selector: 'image-list',
  templateUrl: './image-list.component.html',
  styleUrls: ['./image-list.component.scss']
})
export class ImageListComponent extends ListComponent { 
  @Input() sourceList!: Array<ImageItem>;

  public listManager!: ImageListManager;

  instantiate() {
    this.listManager = new ImageListManager(this.lazyLoadingService);
  }
}