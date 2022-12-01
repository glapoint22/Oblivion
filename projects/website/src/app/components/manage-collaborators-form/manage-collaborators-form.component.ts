import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { DataService, LazyLoad, LazyLoadingService, SpinnerAction, Image } from 'common';
import { Collaborator } from '../../classes/collaborator';
import { ShareListType } from '../../classes/enums';
import { List } from '../../classes/list';
import { ListPermissions } from '../../classes/list-permissions';
import { ShareListFormComponent } from '../share-list-form/share-list-form.component';

@Component({
  selector: 'manage-collaborators-form',
  templateUrl: './manage-collaborators-form.component.html',
  styleUrls: ['./manage-collaborators-form.component.scss']
})
export class ManageCollaboratorsFormComponent extends LazyLoad implements OnInit {
  private indexOfSelectedCollaborator: number = 0;
  private selectedCollaboratorPermissionKeys!: Array<keyof ListPermissions>;
  private initialCollaborators: Array<InitialCollaborator> = new Array<InitialCollaborator>();

  public list!: List;
  public allChecked!: boolean;
  public collaborators!: Array<Collaborator>;
  public updatedCollaborators: Array<Collaborator> = [];
  public selectedCollaborator!: Collaborator;
  public hasChange!: boolean;
  public permissions: Array<string> = [
    'Add to List',
    'Share List',
    'Edit List',
    'Invite Collaborators',
    'Manage Collaborators',
    'Delete List',
    'Remove List Item'
  ];


  @ViewChildren('collaborator') collaboratorItems!: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('permissionInput') permissionInputs!: QueryList<ElementRef<HTMLInputElement>>;


  constructor
    (
      lazyLoadingService: LazyLoadingService,
      private dataService: DataService
    ) { super(lazyLoadingService) }


  ngOnInit(): void {
    super.ngOnInit();

    this.dataService.get<Array<Collaborator>>('api/Lists/GetCollaborators', [{ key: 'listId', value: this.list.id }], {
      authorization: true,
      spinnerAction: SpinnerAction.End
    })
      .subscribe((collaborators: Array<Collaborator>) => {
        this.collaborators = collaborators;

        this.collaborators.forEach((x, i) => {
          this.initialCollaborators.push(new InitialCollaborator());

          Object.values(x.listPermissions).forEach(y => {
            this.initialCollaborators[i].initialPermissions.push(y);
          })
        })

        // If there are collaborators
        if (collaborators.length > 0) {
          this.selectedCollaborator = this.collaborators[0];
          this.selectedCollaboratorPermissionKeys = Object.keys(this.selectedCollaborator.listPermissions) as Array<keyof ListPermissions>;
          this.setPermissions();
          this.setAllChecked();

          // If there are no collaborators
        } else {

          // Remove tab ability from the remove button and all the permissions
          this.tabElements.splice(1, 1);
          while (this.tabElements[1].nativeElement.previousElementSibling instanceof HTMLInputElement) {
            this.tabElements.splice(1, 1);
          }

          // Set focus the base div
          this.base.nativeElement.focus();
        }
      });
  }


  setAllChecked() {
    this.allChecked = !(Object.values(this.selectedCollaborator.listPermissions).some(x => x == false));
  }


  onCollaboratorClick(collaborator: Collaborator) {
    this.selectedCollaborator = collaborator;
    this.setPermissions();
    this.setAllChecked();
  }


  setPermissions() {
    this.selectedCollaboratorPermissionKeys.forEach((permission: keyof ListPermissions, i: number) => {
      this.permissionInputs.get(i)!.nativeElement.checked = this.selectedCollaborator.listPermissions[permission];
    });
  }


  toggleAllChecked() {
    this.selectedCollaboratorPermissionKeys.forEach(key => {
      this.selectedCollaborator.listPermissions[key] = this.allChecked;
    });

    this.setPermissions();
    this.hasChange = true;
    this.addToUpdatedCollaborators();
  }


  onPermissionChange(value: boolean, i: number) {
    this.hasChange = false;
    this.selectedCollaborator.listPermissions[this.selectedCollaboratorPermissionKeys[i]] = value;
    this.setAllChecked();
    this.addToUpdatedCollaborators();

    this.collaborators.forEach((x, i) => {
      Object.values(x.listPermissions).forEach((y, j) => {
        if (y != this.initialCollaborators[i].initialPermissions[j]) this.hasChange = true;
      })
    })
  }


  addToUpdatedCollaborators() {
    if (!this.updatedCollaborators.find(x => x == this.selectedCollaborator)) {
      this.updatedCollaborators.push(this.selectedCollaborator);
    }
  }


  onApplyClick() {
    this.dataService.put('api/Lists/UpdateCollaborators', {
      updatedCollaborators: this.updatedCollaborators,
      listId: this.list.id
    }, { authorization: true })
      .subscribe(() => {
        this.list.collaboratorCount = this.collaborators.length;
        this.close();
      });
  }


  onRemoveClick() {
    this.selectedCollaborator.isRemoved = true;
    this.addToUpdatedCollaborators();

    let index = this.collaborators.findIndex(x => x == this.selectedCollaborator);

    this.collaborators.splice(index, 1);
    this.tabElements.splice(index, 1);

    if (this.collaborators.length > 0) {
      this.onCollaboratorClick(this.collaborators[0]);
    } else {
      this.permissionInputs.forEach(x => x.nativeElement.checked = false);
      this.allChecked = false;
    }
    this.hasChange = true;

    if (this.collaborators.length == 0) {
      this.tabElements.splice(0, 1);

      while (this.tabElements[0].nativeElement.previousElementSibling instanceof HTMLInputElement) {
        this.tabElements.splice(0, 1);
      }

      this.base.nativeElement.focus();
    }
  }




  async openShareList() {
    this.fade();

    this.lazyLoadingService.load(async () => {
      const { ShareListFormComponent } = await import('../../components/share-list-form/share-list-form.component');
      const { ShareListFormModule } = await import('../../components/share-list-form/share-list-form.module');

      return {
        component: ShareListFormComponent,
        module: ShareListFormModule
      }
    }, SpinnerAction.StartEnd)
      .then((shareListForm: ShareListFormComponent) => {
        shareListForm.shareListType = ShareListType.Both;
        shareListForm.list = this.list;
      });
  }


  onArrowDown(e: KeyboardEvent): void {
    this.onArrow(1);
  }


  onArrowUp(e: KeyboardEvent): void {
    this.onArrow(-1);
  }



  onArrow(direction: number) {
    // Increment or decrement the index (depending on direction)
    this.indexOfSelectedCollaborator = this.indexOfSelectedCollaborator + direction;

    // If the index increments past the end of the list or decrements beyond the begining of the list, then loop back around
    if (this.indexOfSelectedCollaborator == (direction == 1 ? this.collaborators.length : -1)) this.indexOfSelectedCollaborator = direction == 1 ? 0 : this.collaborators.length - 1;

    // Select the next item in the list
    this.selectedCollaborator = this.collaborators[this.indexOfSelectedCollaborator];

    // Set focus to the selected list item. This is so the scrollbar can scroll to it (if scrollbar exists)
    this.collaboratorItems.get(this.indexOfSelectedCollaborator)?.nativeElement.focus();

    // Call the onArrowSelect function (if defined)
    this.onCollaboratorClick(this.selectedCollaborator);
  }


  onEnter(e: KeyboardEvent): void {
    if (this.tabElements) {
      if (this.tabElements[this.tabElements.length - 1].nativeElement != document.activeElement &&
        !(this.tabElements[this.tabElements.length - 1].nativeElement as HTMLButtonElement).disabled &&
        document.getElementById("removeButton") != document.activeElement &&
        document.getElementById("cancelButton") != document.activeElement) {
        this.onApplyClick();
      }

      if (document.getElementById("hereLink") == document.activeElement) {
        this.openShareList();
      }
    }
  }


  onScroll(listContainer: HTMLElement) {
    listContainer.scrollTop = Math.round(listContainer.scrollTop / 22) * 22;
  }


  onMouseWheel(e: WheelEvent, listContainer: HTMLElement) {
    e.preventDefault();
    e.stopPropagation();

    const delta = Math.max(-1, Math.min(1, (e.deltaY || -e.detail)));
    listContainer.scrollTop += (delta * 44);
  }
}


export class InitialCollaborator {
  initialPermissions: Array<boolean> = new Array<boolean>();
}