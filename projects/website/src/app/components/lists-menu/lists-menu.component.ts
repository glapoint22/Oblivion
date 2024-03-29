import { Location } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, QueryList, SimpleChanges, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { LazyLoadingService, SpinnerAction } from 'common';
import { ShareListType } from '../../classes/enums';
import { List } from '../../classes/list';
import { DeleteListPromptComponent } from '../../components/delete-list-prompt/delete-list-prompt.component';
import { EditListFormComponent } from '../../components/edit-list-form/edit-list-form.component';
import { ManageCollaboratorsFormComponent } from '../../components/manage-collaborators-form/manage-collaborators-form.component';
import { ShareListFormComponent } from '../../components/share-list-form/share-list-form.component';

@Component({
  selector: 'lists-menu',
  templateUrl: './lists-menu.component.html',
  styleUrls: ['./lists-menu.component.scss']
})
export class ListsMenuComponent {
  @Output() onListClick: EventEmitter<List> = new EventEmitter();
  @Output() onDeleteList: EventEmitter<void> = new EventEmitter();
  @Input() lists!: Array<List>;
  @Input() selectedList!: List;
  @ViewChildren('list') HtmlLists!: QueryList<ElementRef<HTMLElement>>;
  @ViewChild('listSettingsPopupContainer', { read: ViewContainerRef }) listSettingsPopupContainer!: ViewContainerRef;

  constructor
    (
      private lazyLoadingService: LazyLoadingService,
      private location: Location
    ) { }




  ngOnChanges() {
    window.setTimeout(() => {
      const indexOfSelectedList = this.lists.indexOf(this.selectedList);
      this.HtmlLists.get(indexOfSelectedList)?.nativeElement.focus();
    })
  }



  async onEditListClick() {
    this.lazyLoadingService.load(async () => {
      const { EditListFormComponent } = await import('../../components/edit-list-form/edit-list-form.component');
      const { EditListFormModule } = await import('../../components/edit-list-form/edit-list-form.module');

      return {
        component: EditListFormComponent,
        module: EditListFormModule
      }
    }, SpinnerAction.StartEnd)
      .then((editListFormComponent: EditListFormComponent) => {
        editListFormComponent.list = this.selectedList;

        const editListFormComponentOnInitSubscription = editListFormComponent.onInit.subscribe(() => {
          editListFormComponentOnInitSubscription.unsubscribe();
          // Get the controls from the edit list form
          const listName = editListFormComponent.form.get('listName');
          const description = editListFormComponent.form.get('description');

          // Set the values based on the selected list
          listName?.setValue(this.selectedList.name);
          description?.setValue(this.selectedList.description);
        });

      });
  }



  async onShareListClick() {
    this.lazyLoadingService.load(async () => {
      const { ShareListFormComponent } = await import('../../components/share-list-form/share-list-form.component');
      const { ShareListFormModule } = await import('../../components/share-list-form/share-list-form.module');

      return {
        component: ShareListFormComponent,
        module: ShareListFormModule
      }
    }, SpinnerAction.StartEnd)
      .then((shareListForm: ShareListFormComponent) => {
        if (this.selectedList.isOwner || (this.selectedList.listPermissions.canShareList && this.selectedList.listPermissions.canInviteCollaborators)) {
          shareListForm.shareListType = ShareListType.Both;
        } else if (this.selectedList.listPermissions.canShareList) {
          shareListForm.shareListType = ShareListType.Share;
        } else if (this.selectedList.listPermissions.canInviteCollaborators) {
          shareListForm.shareListType = ShareListType.Collaborate;
        }

        shareListForm.list = this.selectedList;
      });
  }



  async onManageCollaboratorsClick() {
    this.lazyLoadingService.load(async () => {
      const { ManageCollaboratorsFormComponent } = await import('../../components/manage-collaborators-form/manage-collaborators-form.component');
      const { ManageCollaboratorsFormModule } = await import('../../components/manage-collaborators-form/manage-collaborators-form.module');

      return {
        component: ManageCollaboratorsFormComponent,
        module: ManageCollaboratorsFormModule
      }
    }, SpinnerAction.Start)
      .then((manageCollaboratorsForm: ManageCollaboratorsFormComponent) => {
        manageCollaboratorsForm.list = this.selectedList;
      });
  }



  async onDeleteListClick() {
    this.lazyLoadingService.load(async () => {
      const { DeleteListPromptComponent } = await import('../../components/delete-list-prompt/delete-list-prompt.component');
      const { DeleteListPromptModule } = await import('../../components/delete-list-prompt/delete-list-prompt.module');

      return {
        component: DeleteListPromptComponent,
        module: DeleteListPromptModule
      }
    }, SpinnerAction.StartEnd)
      .then((deleteListPrompt: DeleteListPromptComponent) => {
        deleteListPrompt.list = this.selectedList;

        const deleteListPromptOnDeleteSubscription = deleteListPrompt.onDelete.subscribe(() => {
          deleteListPromptOnDeleteSubscription.unsubscribe();
          this.lists.splice(this.lists.indexOf(this.selectedList), 1);

          if (this.lists.length > 0) {
            this.onListClick.emit(this.lists[0]);
          } else {
            this.location.replaceState("account/lists");
          }
          this.onDeleteList.emit();
        });
      });
  }
}