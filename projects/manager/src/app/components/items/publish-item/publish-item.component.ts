import { Component, Input } from '@angular/core';
import { BuilderType, PublishStatus } from '../../../classes/enums';
import { PublishItem } from '../../../classes/publish-item';
import { ListItemComponent } from '../list-item/list-item.component';

@Component({
  selector: 'publish-item',
  templateUrl: './publish-item.component.html',
  styleUrls: ['../list-item/list-item.component.scss', './publish-item.component.scss']
})
export class PublishItemComponent extends ListItemComponent {
  @Input() item!: PublishItem;
  public PublishType = BuilderType;
  public PublishStatus = PublishStatus;
}