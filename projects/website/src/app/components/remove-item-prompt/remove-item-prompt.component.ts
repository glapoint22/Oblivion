import { Component } from '@angular/core';
import { LazyLoad } from '../../classes/lazy-load';

@Component({
  selector: 'remove-item-prompt',
  templateUrl: './remove-item-prompt.component.html',
  styleUrls: ['./remove-item-prompt.component.scss']
})
export class RemoveItemPromptComponent extends LazyLoad { }
