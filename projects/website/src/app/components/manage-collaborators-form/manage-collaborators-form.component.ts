import { Component } from '@angular/core';
import { Modal } from '../../classes/modal';

@Component({
  selector: 'manage-collaborators-form',
  templateUrl: './manage-collaborators-form.component.html',
  styleUrls: ['./manage-collaborators-form.component.scss']
})
export class ManageCollaboratorsFormComponent extends Modal {
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
    'Edit List',
    'Delete List',
    'Move Item',
    'Remove Item'
  ]
  

  

}
