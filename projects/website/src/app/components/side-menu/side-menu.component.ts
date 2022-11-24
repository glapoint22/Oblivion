import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService, DataService, LazyLoad, LazyLoadingService, SpinnerAction } from 'common';
import { Niche } from '../../classes/niche';
import { NichesService } from '../../services/niches/niches.service';
import { AccountListComponent } from '../account-list/account-list.component';

@Component({
  selector: 'side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent extends LazyLoad implements OnInit {
  public niches!: Array<Niche>;
  public subNiches: Array<Niche> | undefined;
  public selectedNicheName!: string;
  public focusedListItemId!: string;
  public focusedSubListItemId: string = '0';
  private index: number = -1;
  private subIndex: number = 0;
  @ViewChild('accountList') accountList!: AccountListComponent;

  constructor
    (
      lazyLoadingService: LazyLoadingService,
      private nicheService: NichesService,
      public accountService: AccountService,
      private dataService: DataService,
      private router: Router
    ) { super(lazyLoadingService) }


  ngOnInit(): void {
    this.addEventListeners();
    this.nicheService.getNiches()
      .subscribe((niches: Array<Niche>) => {
        this.niches = niches;
      });

    window.addEventListener('mousedown', this.mousedown);
    window.addEventListener('blur', this.windowBlur);
  }


  ngAfterViewInit(): void {
    this.open();
  }


  mousedown = () => {
    this.close();
  }


  windowBlur = () => {
    this.close();
  }


  async onLogInLinkClick() {
    this.close();

    this.lazyLoadingService.load(async () => {
      const { LogInFormComponent } = await import('../log-in-form/log-in-form.component');
      const { LogInFormModule } = await import('../log-in-form/log-in-form.module');

      return {
        component: LogInFormComponent,
        module: LogInFormModule
      }
    }, SpinnerAction.StartEnd);
  }


  async onSignUpLinkClick() {
    this.close();

    this.lazyLoadingService.load(async () => {
      const { SignUpFormComponent } = await import('../sign-up-form/sign-up-form.component');
      const { SignUpFormModule } = await import('../sign-up-form/sign-up-form.module');

      return {
        component: SignUpFormComponent,
        module: SignUpFormModule
      }
    }, SpinnerAction.StartEnd);
  }



  onNicheClick(niche: Niche, nicheFocusId: string) {
    this.selectedNicheName = niche.name;
    this.focusedListItemId = nicheFocusId;
    this.index = parseInt(nicheFocusId);

    this.dataService.get<Array<Niche>>('api/Niches/GetSubniches', [{ key: 'nicheId', value: niche.id }])
      .subscribe((niches: Array<Niche>) => {
        this.subNiches = niches;
      });
  }


  onMainMenuButtonClick() {
    this.subNiches = undefined;
    this.subIndex = 0;
    this.focusedSubListItemId = '0';
  }


  onSubNicheClick(subniche: Niche) {
    this.close();
    this.router.navigate(['/browse'], {
      queryParams: { subnicheName: subniche.urlName, subnicheId: subniche.id }
    });
  }


  onTab(direction: number): void {
    // Niches
    if (!this.subNiches) {
      this.index = this.index + (1 * direction);
      if (this.index > (this.niches.length - 1) + 5) this.index = 0;
      if (this.index < 0) this.index = (this.niches.length - 1) + 5;
      this.focusedListItemId = this.index.toString();
      this.accountList.focusedListItemId = this.focusedListItemId;

      // Sub niches
    } else {
      this.subIndex = this.subIndex + (1 * direction);
      if (this.subIndex > (this.subNiches.length - 1) + 1) this.subIndex = 0;
      if (this.subIndex < 0) this.subIndex = (this.subNiches.length - 1) + 1;
      this.focusedSubListItemId = this.subIndex.toString();
    }
  }


  onArrowDown(e: KeyboardEvent): void {
    e.preventDefault();

    // Niches
    if (!this.subNiches) {
      this.index = this.index + 1;
      if (this.index > (this.niches.length - 1) + 5) this.index = (this.niches.length - 1) + 5;
      this.focusedListItemId = this.index.toString();
      this.accountList.focusedListItemId = this.focusedListItemId;

      // Sub niches
    } else {
      this.subIndex = this.subIndex + 1;
      if (this.subIndex > (this.subNiches.length - 1) + 1) this.subIndex = (this.subNiches.length - 1) + 1;
      this.focusedSubListItemId = this.subIndex.toString();
    }
  }


  onArrowUp(e: KeyboardEvent): void {
    e.preventDefault();

    // Niches
    if (!this.subNiches) {
      this.index = this.index - 1;
      if (this.index < 0) this.index = 0;
      this.focusedListItemId = this.index.toString();
      this.accountList.focusedListItemId = this.focusedListItemId;

      // Sub niches
    } else {
      this.subIndex = this.subIndex - 1;
      if (this.subIndex < 0) this.subIndex = 0;
      this.focusedSubListItemId = this.subIndex.toString();
    }
  }


  onEnter(e: KeyboardEvent): void {

    if (!this.subNiches) {


      if (this.index <= 5) {

        switch (this.index) {
          case 0:
            this.router.navigate(['account']);
            break;

          case 1:
            this.router.navigate(['account/orders']);
            break;

          case 2:
            this.router.navigate(['account/lists']);
            break;

          case 3:
            this.router.navigate(['account/profile']);
            break;

          case 4:
            this.router.navigate(['account/email-preferences']);
            break;

          case 5:
            this.accountList.onLogOutClick();
            break;
        }


      } else {
        this.onNicheClick(this.niches[this.index - 5], this.focusedListItemId);
      }

    } else {

      if (this.subIndex == 0) {
        this.onMainMenuButtonClick();
      } else {
        this.onSubNicheClick(this.subNiches[this.subIndex - 1]);
      }
    }
  }


  ngOnDestroy() {
    super.ngOnDestroy();
    window.removeEventListener('mousedown', this.mousedown);
    window.removeEventListener('blur', this.windowBlur);
  }
}