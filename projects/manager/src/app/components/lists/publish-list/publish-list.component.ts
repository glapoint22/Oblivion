import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PublishItem } from '../../../classes/publish-item';
import { ListComponent } from '../list/list.component';

@Component({
  selector: 'publish-list',
  templateUrl: './publish-list.component.html',
  styleUrls: ['./publish-list.component.scss']
})
export class PublishListComponent extends ListComponent {
  @Input() sourceList!: Array<PublishItem>;
  @Output() onPublish: EventEmitter<PublishItem> = new EventEmitter();
}