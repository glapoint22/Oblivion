import { Component, OnInit } from '@angular/core';
import { LazyLoad } from '../../classes/lazy-load';
import { Niche } from '../../classes/niche';
import { AccountService } from '../../services/account/account.service';
import { DataService } from '../../services/data/data.service';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';
import { NichesService } from '../../services/niches/niches.service';
import { SpinnerService } from '../../services/spinner/spinner.service';

@Component({
  selector: 'side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent extends LazyLoad implements OnInit {
  public niches!: Array<Niche>;
  public subNiches: Array<Niche> | undefined;
  public selectedNicheName!: string;

  constructor(
    private nicheService: NichesService,
    public accountService: AccountService,
    private lazyLoadingService: LazyLoadingService,
    private dataService: DataService,
    private spinnerService: SpinnerService
  ) { super(); }


  ngOnInit(): void {
    this.nicheService.getNiches()
      .subscribe((niches: Array<Niche>) => {
        this.niches = niches;
      });
  }


  async onLogInLinkClick() {
    this.spinnerService.show = true;
    this.close();
    const { LogInFormComponent } = await import('../log-in-form/log-in-form.component');
    const { LogInFormModule } = await import('../log-in-form/log-in-form.module')

    this.lazyLoadingService.getComponentAsync(LogInFormComponent, LogInFormModule, this.lazyLoadingService.container)
      .then(() => {
        this.spinnerService.show = false;
      });
  }


  async onSignUpLinkClick() {
    this.spinnerService.show = true;
    this.close();
    const { SignUpFormComponent } = await import('../sign-up-form/sign-up-form.component');
    const { SignUpFormModule } = await import('../sign-up-form/sign-up-form.module')

    this.lazyLoadingService.getComponentAsync(SignUpFormComponent, SignUpFormModule, this.lazyLoadingService.container)
      .then(() => {
        this.spinnerService.show = false;
      });
  }



  onNicheClick(niche: Niche) {
    this.selectedNicheName = niche.name;

    this.dataService.get<Array<Niche>>('api/Niches', [{ key: 'id', value: niche.id }])
      .subscribe((niches: Array<Niche>) => {
        this.subNiches = niches;
      });
  }

}