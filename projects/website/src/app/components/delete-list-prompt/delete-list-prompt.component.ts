import { Component } from '@angular/core';
import { LazyLoad } from '../../classes/lazy-load';

@Component({
  selector: 'delete-list-prompt',
  templateUrl: './delete-list-prompt.component.html',
  styleUrls: ['./delete-list-prompt.component.scss']
})
export class DeleteListPromptComponent extends LazyLoad { }