import { Component } from '@angular/core';
import { LazyLoad } from '../../classes/lazy-load';

@Component({
  selector: 'remove-collaborator-prompt',
  templateUrl: './remove-collaborator-prompt.component.html',
  styleUrls: ['./remove-collaborator-prompt.component.scss']
})
export class RemoveCollaboratorPromptComponent extends LazyLoad { }