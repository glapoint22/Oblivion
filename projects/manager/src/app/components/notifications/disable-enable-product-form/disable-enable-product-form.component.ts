import { Component } from '@angular/core';
import { LazyLoad, SpinnerAction } from 'common';
import { Subject } from 'rxjs';
import { MenuOptionType } from '../../../classes/enums';
import { NotificationItem } from '../../../classes/notifications/notification-item';
import { ProductNotification } from '../../../classes/notifications/product-notification';
import { ContextMenuComponent } from '../../context-menu/context-menu.component';

@Component({
  templateUrl: './disable-enable-product-form.component.html',
  styleUrls: ['./disable-enable-product-form.component.scss']
})
export class DisableEnableProductFormComponent extends LazyLoad {
  public notification!: ProductNotification;
  public notificationItem!: NotificationItem;
  public employeeNotes!: string;
  public contextMenu!: ContextMenuComponent;
  public callback!: Function;
  public newNoteAdded!: boolean;
  public userIndex: number = 0;
  public onClose: Subject<void> = new Subject<void>();

  ngOnInit() {
    super.ngOnInit();
    document.getElementById('modalBase')?.focus();
  }


  onNotes(notes: HTMLTextAreaElement) {
    this.employeeNotes = notes.value.trim();
  }


  onRemoveButton() {
    this.close();
    if(this.notification.employeeNotes.length > 0 && this.employeeNotes.length > 0) this.newNoteAdded = true;
    this.callback(this.employeeNotes, this.newNoteAdded);
  }


  // =================================================================( OPEN CONTEXT MENU )================================================================= \\

  openContextMenu(ellipsis: HTMLElement) {
    if (this.contextMenu) {
      this.contextMenu.close();
      return;
    }
    this.lazyLoadingService.load(async () => {
      const { ContextMenuComponent } = await import('../../context-menu/context-menu.component');
      const { ContextMenuModule } = await import('../../context-menu/context-menu.module');

      return {
        component: ContextMenuComponent,
        module: ContextMenuModule
      }
    }, SpinnerAction.None).then((contextMenu: ContextMenuComponent) => {
      this.contextMenu = contextMenu;
      contextMenu.xPos = ellipsis.getBoundingClientRect().left - 165;
      contextMenu.yPos = ellipsis.getBoundingClientRect().top + 21;
      contextMenu.parentObj = this;
      contextMenu.options =[
        {
          type: MenuOptionType.MenuItem,
          name: 'Go to Product Website',
          optionFunction: () => {
            window.open(this.notification.productHoplink, '_blank');
          }
        }
      ];

      const contextMenuOpenListener = contextMenu.menuOpen.subscribe((menuOpen: boolean) => {
        contextMenuOpenListener.unsubscribe();
        this.contextMenu = null!;
      })
    });
  }


  onEnter(e: KeyboardEvent): void {
    if (this.tabElements[0].nativeElement != document.activeElement && this.tabElements[1].nativeElement != document.activeElement && this.tabElements[2].nativeElement != document.activeElement) {
      this.onRemoveButton();
    }
  }


  close() {
    super.close();
    this.onClose.next();
  }
}