import { Component, HostListener, ViewChild } from '@angular/core';
import { LazyLoad } from 'common';
import { Subject } from 'rxjs';
import { ListComponent } from '../lists/list/list.component';
import { SideMenuNichesComponent } from '../side-menu-niches/side-menu-niches.component';

@Component({
  selector: 'niches-side-menu',
  templateUrl: './niches-side-menu.component.html',
  styleUrls: ['./niches-side-menu.component.scss']
})
export class NichesSideMenuComponent extends LazyLoad {
  public nichesSideMenuOpen: Subject<boolean> = new Subject<boolean>();
  @ViewChild('sideMenuNiches') sideMenuNiches!: SideMenuNichesComponent;


  @HostListener('window:mousedown')
  onWindowMouseDown() {
    this.onClose();
  }


  @HostListener('window:blur')
  onWindowBlur() {
    this.evaluateWindowBlur(this.sideMenuNiches.listComponent);
    this.evaluateWindowBlur(this.sideMenuNiches.searchComponent);
  }


  evaluateWindowBlur(component: ListComponent) {
    if (component) {

      if (!this.sideMenuNiches.moveFormOpen &&
        !component.listManager.promptOpen) {

        this.close();
        if (component.listManager.editedItem) {
          component.listManager.selectedItem = component.listManager.editedItem;
          component.listManager.editedItem = null!;
        }
      }
    }
  }



  evaluateClose(component: ListComponent) {
    if (component) {
      if (!this.sideMenuNiches.moveFormOpen &&
        !component.listManager.promptOpen &&
        !component.listManager.editedItem &&
        !component.listManager.contextMenuOpen) {
        this.close();
      }
    }
  }



  onClose() {
    this.evaluateClose(this.sideMenuNiches.listComponent);
    this.evaluateClose(this.sideMenuNiches.searchComponent);
  }


  onOpen(): void {
    this.sideMenuNiches.onOpen();
  }


  onEscape(): void {
    this.onClose();
  }


  close(): void {
    super.close();
    this.nichesSideMenuOpen.next(false);
    if (this.sideMenuNiches.listComponent) this.sideMenuNiches.listComponent.listManager.setRemoveEventListeners();
    if (this.sideMenuNiches.searchComponent) this.sideMenuNiches.searchComponent.listManager.setRemoveEventListeners();
  }
}