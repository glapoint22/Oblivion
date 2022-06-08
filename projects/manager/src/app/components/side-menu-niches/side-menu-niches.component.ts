import { Component, Input } from '@angular/core';
import { SideMenuNichesUpdateManager } from '../../classes/side-menu-niches-update-manager';

@Component({
  selector: 'side-menu-niches',
  templateUrl: './side-menu-niches.component.html',
  styleUrls: ['./side-menu-niches.component.scss']
})
export class SideMenuNichesComponent extends SideMenuNichesUpdateManager {
  @Input() base!: HTMLElement;
 }