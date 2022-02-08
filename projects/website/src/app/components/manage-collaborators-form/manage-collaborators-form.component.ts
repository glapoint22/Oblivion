import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Collaborator } from '../../classes/collaborator';
import { ShareListType } from '../../classes/enums';
import { LazyLoad } from '../../classes/lazy-load';
import { List } from '../../classes/list';
import { ListPermissions } from '../../classes/list-permissions';
import { DataService } from '../../services/data/data.service';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { ShareListFormComponent } from '../share-list-form/share-list-form.component';

@Component({
  selector: 'manage-collaborators-form',
  templateUrl: './manage-collaborators-form.component.html',
  styleUrls: ['./manage-collaborators-form.component.scss']
})
export class ManageCollaboratorsFormComponent extends LazyLoad implements OnInit {
  @ViewChildren('permissionInputs') permissionInputs!: QueryList<ElementRef<HTMLInputElement>>;
  private selectedCollaboratorPermissionKeys!: Array<keyof ListPermissions>;
  public list!: List;
  public allChecked!: boolean;
  public collaborators!: Array<Collaborator>;
  public updatedCollaborators: Array<Collaborator> = [];
  public selectedCollaborator!: Collaborator;
  public permissionCheckboxes!: Array<ElementRef<HTMLInputElement>>;
  public hasChange!: boolean;
  public permissions: Array<string> = [
    'Add to List',
    'Share List',
    'Edit List',
    'Invite Collaborators',
    'Delete List',
    'Move Item',
    'Remove Item'
  ];

  constructor
    (
      lazyLoadingService: LazyLoadingService,
      private dataService: DataService,
      private spinnerService: SpinnerService
    ) { super(lazyLoadingService) }


  ngOnInit(): void {
    super.ngOnInit();
    this.dataService.get<Array<Collaborator>>('api/Lists/Collaborators', [{ key: 'listId', value: this.list.id }], {
      authorization: true,
      showSpinner: true
    })
      .subscribe((collaborators: Array<Collaborator>) => {
        this.collaborators = collaborators;

        // If there are collaborators
        if (collaborators.length > 0) {
          this.selectedCollaborator = this.collaborators[0];
          this.selectedCollaboratorPermissionKeys = Object.keys(this.selectedCollaborator.listPermissions) as Array<keyof ListPermissions>;
          this.setPermissions();
          this.setAllChecked();

          // Wait while the collaborators are being created in the view
          window.setTimeout(() => {
            // The tabElements array was already populated in ngAfterViewInit but the collaborators probably weren't available
            // at that time, so we're updating tabElements again so that the collaborators can be in the array
            this.tabElements = this.HTMLElements.toArray();
            this.tabElements[0].nativeElement.focus();
          }, 100);

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


  ngAfterViewInit() {
    super.ngAfterViewInit();
    this.permissionCheckboxes = this.permissionInputs.toArray();
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
      this.permissionCheckboxes[i].nativeElement.checked = this.selectedCollaborator.listPermissions[permission];
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
    this.selectedCollaborator.listPermissions[this.selectedCollaboratorPermissionKeys[i]] = value;
    this.setAllChecked();
    this.hasChange = true;
    this.addToUpdatedCollaborators();
  }


  addToUpdatedCollaborators() {
    if (!this.updatedCollaborators.find(x => x == this.selectedCollaborator)) {
      this.updatedCollaborators.push(this.selectedCollaborator);
    }
  }


  onApplyClick() {
    this.dataService.put('api/Lists/UpdateCollaborators', this.updatedCollaborators, { authorization: true })
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
      this.permissionCheckboxes.forEach(x => x.nativeElement.checked = false);
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
    this.spinnerService.show = true;
    const { ShareListFormComponent } = await import('../../components/share-list-form/share-list-form.component');
    const { ShareListFormModule } = await import('../../components/share-list-form/share-list-form.module');

    this.lazyLoadingService.getComponentAsync(ShareListFormComponent, ShareListFormModule, this.lazyLoadingService.container)
      .then((shareListForm: ShareListFormComponent) => {
        shareListForm.shareListType = ShareListType.Both;
        shareListForm.list = this.list;
        this.spinnerService.show = false;
      });
  }


  onSpace(e: KeyboardEvent): void {
    e.preventDefault();

    if (this.tabElements) {
      let checkboxIndex = -2;

      // Loop through all the tab elements
      for (let i = 0; i < this.tabElements.length; i++) {

        // Check to see if any of the tab elements have the focus
        if (this.tabElements[i].nativeElement == document.activeElement) {

          // If a collaborator has the focus
          if (this.tabElements[i].nativeElement.id == "collaborator") {
            this.onCollaboratorClick(this.collaborators[i]);
          }
        }



        // If the tab element is a checkbox
        if (this.tabElements[i].nativeElement.previousElementSibling instanceof HTMLInputElement) {
          // increment the checkbox indexes
          checkboxIndex++;

          // Check to see if any of the checkboxes have the focus
          if (this.tabElements[i].nativeElement == document.activeElement) {

            // If the Full Controll checkbox has the focus
            if (checkboxIndex == -1) {
              this.allChecked = !this.allChecked;
              this.toggleAllChecked();

              // If any of the other checkboxes have the focus
            } else {
              (this.tabElements[i].nativeElement.previousElementSibling as HTMLInputElement).checked = !(this.tabElements[i].nativeElement.previousElementSibling as HTMLInputElement).checked;
              this.onPermissionChange((this.tabElements[i].nativeElement.previousElementSibling as HTMLInputElement).checked, checkboxIndex);
            }
          }
        }
      }
    }
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
}