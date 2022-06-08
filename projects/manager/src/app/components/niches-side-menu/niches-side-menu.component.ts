import { Component, ViewChild } from '@angular/core';
import { LazyLoad } from 'common';
import { Subject } from 'rxjs';
import { SideMenuNichesComponent } from '../side-menu-niches/side-menu-niches.component';

@Component({
  selector: 'niches-side-menu',
  templateUrl: './niches-side-menu.component.html',
  styleUrls: ['./niches-side-menu.component.scss']
})
export class NichesSideMenuComponent extends LazyLoad {
  // Public
  public overNichesSideMenu: Subject<boolean> = new Subject<boolean>();
  @ViewChild('sideMenuNiches') sideMenuNiches!: SideMenuNichesComponent;


  onOpen(): void {
    this.sideMenuNiches.onOpen();
  }


  onEscape(): void {
    this.sideMenuNiches.onEscape();
  }
}