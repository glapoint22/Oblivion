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
  public list!: List;
  public collaborators!: Array<Collaborator>;
  public updatedCollaborators: Array<Collaborator> = [];
  public selectedCollaborator!: Collaborator;
  public permissionCheckboxes!: Array<ElementRef<HTMLInputElement>>;
  public hasChange!: boolean;
  @ViewChildren('permissionInputs') permissionInputs!: QueryList<ElementRef<HTMLInputElement>>;


  public permissions: Array<string> = [
    'Add to List',
    'Share List',
    'Edit List',
    'Invite Collaborators',
    'Delete List',
    'Move Item',
    'Remove Item'
  ];

  private selectedCollaboratorPermissionKeys!: Array<keyof ListPermissions>;
  public allChecked!: boolean;


  constructor
    (
      private dataService: DataService,
      private lazyLoadingService: LazyLoadingService,
      private spinnerService: SpinnerService
    ) { super(); }


  ngOnInit(): void {
    this.dataService.get<Array<Collaborator>>('api/Lists/Collaborators', [{ key: 'listId', value: this.list.id }], {
      authorization: true,
      showSpinner: true
    })
      .subscribe((collaborators: Array<Collaborator>) => {
        this.collaborators = collaborators;
        if (collaborators.length > 0) {
          this.selectedCollaborator = this.collaborators[0];
          this.selectedCollaboratorPermissionKeys = Object.keys(this.selectedCollaborator.listPermissions) as Array<keyof ListPermissions>;
          this.setPermissions();
          this.setAllChecked();
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
    this.collaborators.splice(this.collaborators.findIndex(x => x == this.selectedCollaborator), 1);

    if (this.collaborators.length > 0) {
      this.onCollaboratorClick(this.collaborators[0]);
    } else {
      this.permissionCheckboxes.forEach(x => x.nativeElement.checked = false);
      this.allChecked = false;
    }
    this.hasChange = true;
  }




  async openShareList() {
    this.spinnerService.show = true;
    this.fade();

    const { ShareListFormComponent } = await import('../../components/share-list-form/share-list-form.component');
    const { ShareListFormModule } = await import('../../components/share-list-form/share-list-form.module');

    this.lazyLoadingService.getComponentAsync(ShareListFormComponent, ShareListFormModule, this.lazyLoadingService.container)
      .then((shareListForm: ShareListFormComponent) => {
        shareListForm.shareListType = ShareListType.Both;
        shareListForm.list = this.list;
        shareListForm.manageCollaboratorsForm = this;
        this.spinnerService.show = false;
      });
  }
}