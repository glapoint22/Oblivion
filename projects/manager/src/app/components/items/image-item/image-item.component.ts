import { Component, Input } from '@angular/core';
import { ImageItem } from '../../../classes/image-item';
import { ImageListManager } from '../../../classes/image-list-manager';
import { ListItemComponent } from '../list-item/list-item.component';

@Component({
  selector: 'image-item',
  templateUrl: './image-item.component.html',
  styleUrls: ['../list-item/list-item.component.scss', './image-item.component.scss']
})
export class ImageItemComponent extends ListItemComponent { 
  @Input() item!: ImageItem;
  @Input() listManager!: ImageListManager;
}