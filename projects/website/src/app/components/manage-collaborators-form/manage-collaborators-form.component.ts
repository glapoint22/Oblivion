import { Component } from '@angular/core';
import { LazyLoad } from '../../classes/lazy-load';

@Component({
  selector: 'manage-collaborators-form',
  templateUrl: './manage-collaborators-form.component.html',
  styleUrls: ['./manage-collaborators-form.component.scss']
})
export class ManageCollaboratorsFormComponent extends LazyLoad {
  public collaborators: Array<string> = [
    'Trumpy',
    'Alita',
    'Buffy',
    'Willow',
    'Gabey Gump',
    'Brony Gumpy',
    'Titty Pussy'
  ];

  public selectedCollaborator: string = this.collaborators[0];

  public permissions: Array<string> = [
    'Full Control',
    'Add to List',
    'Share List',
    'Invite Collaborators',
    'Edit List',
    'Delete List',
    'Move Item',
    'Remove Item'
  ]
  

  

}
