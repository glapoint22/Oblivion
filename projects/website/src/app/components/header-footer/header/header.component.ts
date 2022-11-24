import { KeyValue } from '@angular/common';
import { Component, ElementRef, ViewChild, ViewContainerRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, ParamMap, Params, Router } from '@angular/router';
import { AccountService, DataService, LazyLoadingService, SpinnerAction } from 'common';
import { debounceTime, delay, fromEvent, merge, Observable, of, switchMap } from 'rxjs';
import { Niche } from '../../../classes/niche';
import { Suggestion } from '../../../classes/suggestion';
import { NichesService } from '../../../services/niches/niches.service';
import { AccountMenuPopupComponent } from '../../account-menu-popup/account-menu-popup.component';
import { NicheMenuPopupComponent } from '../../niche-menu-popup/niche-menu-popup.component';
import { SideMenuComponent } from '../../side-menu/side-menu.component';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  private searchTerm!: string;
  private nicheMenuPopup!: NicheMenuPopupComponent;
  private accountMenuPopup!: AccountMenuPopupComponent;


  public selectedNiche!: Niche;
  public sideMenu!: SideMenuComponent;
  public suggestionIndex: number = -1;
  public nicheMenuPopupOpen!: boolean;
  public accountMenuPopupOpen!: boolean;
  public suggestions: Array<Suggestion> = [];
  public suggestionListMousedown: boolean = false;


  @ViewChild('arrow') arrow!: ElementRef<HTMLElement>;
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  @ViewChild('sideMenuContainer', { read: ViewContainerRef }) sideMenuContainer!: ViewContainerRef;
  @ViewChild('nicheMenuPopupContainer', { read: ViewContainerRef }) nicheMenuPopupContainer!: ViewContainerRef;
  @ViewChild('accountMenuPopupContainer', { read: ViewContainerRef }) accountMenuPopupContainer!: ViewContainerRef;



  constructor(
    private lazyLoadingService: LazyLoadingService,
    public accountService: AccountService,
    private sanitizer: DomSanitizer,
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private nicheService: NichesService
  ) { }



  async ngOnInit() {
    this.nicheService.getNiches();
    const { NicheMenuPopupComponent } = await import('../../niche-menu-popup/niche-menu-popup.component');
    const { NicheMenuPopupModule } = await import('../../niche-menu-popup/niche-menu-popup.module');
    const { AccountMenuPopupComponent } = await import('../../account-menu-popup/account-menu-popup.component');
    const { AccountMenuPopupModule } = await import('../../account-menu-popup/account-menu-popup.module');
  }



  ngAfterViewInit() {
    const nicheId = this.route.snapshot.queryParamMap.get('nicheId') as string;

    this.selectedNiche = {
      id: 'all',
      name: 'All Niches',
      urlName: ''
    }

    if (nicheId) {
      this.nicheService.getNiches()
        .pipe(delay(1))
        .subscribe((niches: Array<Niche>) => {
          this.selectedNiche = niches.find(x => x.id == nicheId) as Niche;
        });
    }

    this.route.queryParamMap.subscribe((queryParams: ParamMap) => {
      this.searchInput.nativeElement.value = queryParams.get('search') as string;
    });


    const inputEvent = fromEvent(this.searchInput.nativeElement, 'input');
    const mousedownEvent = fromEvent(this.searchInput.nativeElement, 'mousedown');
    const bothEvents = merge(inputEvent, mousedownEvent);

    bothEvents
      .pipe<Event, Array<Suggestion>>(
        debounceTime(100),
        switchMap<Event, Observable<Array<Suggestion>>>(input => {
          this.searchTerm = (input.target as HTMLInputElement).value;

          if (this.searchTerm == '') {
            this.suggestions = [];
            return of(this.suggestions);
          }


          let parameters: Array<KeyValue<string, string>>;

          if (this.selectedNiche && this.selectedNiche.id != 'all') {
            parameters = [
              {
                key: 'searchTerm',
                value: this.searchTerm.toLowerCase()
              },
              {
                key: 'nicheId',
                value: this.selectedNiche.id
              }
            ]
          } else {
            parameters = [{ key: 'searchTerm', value: this.searchTerm.toLowerCase() }];
          }


          return this.dataService.get<Array<Suggestion>>('api/Products/GetSearchSuggestions', parameters)
        })
      )
      .subscribe((suggestions: Array<Suggestion>) => {
        this.suggestions = [];
        this.suggestionIndex = -1;

        if (suggestions) {
          let suggestionsCount: number;

          if (window.innerHeight > 800) {
            suggestionsCount = suggestions.length;
          } else if (window.innerHeight > 600) {
            suggestionsCount = Math.min(8, suggestions.length);
          } else if (window.innerHeight > 400) {
            suggestionsCount = Math.min(6, suggestions.length);
          } else {
            suggestionsCount = Math.min(4, suggestions.length);
          }


          for (let i = 0; i < suggestionsCount; i++) {
            let suggestion: Suggestion = suggestions[i];

            // Escape the special characters
            let searchWords = this.searchTerm.replace(/[+*?^$\.\[\]{}()|/]/g, x => '\\' + x);

            let html: string = suggestion.name.replace(new RegExp("\\b" + searchWords.trim(), "i"), '<span style="font-weight: 900;">' + searchWords.trim().toLowerCase() + '</span>');

            this.suggestions.push({
              name: suggestion.name,
              niche: suggestion.niche,
              html: this.sanitizer.bypassSecurityTrustHtml(html)
            });
          }
        }
      });
  }


  

  onHamburgerButtonClick() {
    if (this.sideMenuContainer.length == 0) {
      this.lazyLoadingService.load(async () => {
        const { SideMenuComponent } = await import('../../side-menu/side-menu.component');
        const { SideMenuModule } = await import('../../side-menu/side-menu.module');

        return {
          component: SideMenuComponent,
          module: SideMenuModule
        }
      }, SpinnerAction.StartEnd, this.sideMenuContainer)
        .then((sideMenu: SideMenuComponent) => {
          this.sideMenu = sideMenu;
        });
    }
  }




  async onSignUpClick(): Promise<void> {
    this.lazyLoadingService.load(async () => {
      const { SignUpFormComponent } = await import('../../sign-up-form/sign-up-form.component');
      const { SignUpFormModule } = await import('../../sign-up-form/sign-up-form.module');

      return {
        component: SignUpFormComponent,
        module: SignUpFormModule
      }
    }, SpinnerAction.StartEnd);
  }



  async onLoginClick(): Promise<void> {
    this.lazyLoadingService.load(async () => {
      const { LogInFormComponent } = await import('../../log-in-form/log-in-form.component');
      const { LogInFormModule } = await import('../../log-in-form/log-in-form.module');

      return {
        component: LogInFormComponent,
        module: LogInFormModule
      }
    }, SpinnerAction.StartEnd);

  }




  onNichesButtonClick() {
    if (this.nicheMenuPopupOpen) {
      this.nicheMenuPopup.close();
      return;
    }

    this.lazyLoadingService.load(async () => {
      const { NicheMenuPopupComponent } = await import('../../niche-menu-popup/niche-menu-popup.component');
      const { NicheMenuPopupModule } = await import('../../niche-menu-popup/niche-menu-popup.module');

      return {
        component: NicheMenuPopupComponent,
        module: NicheMenuPopupModule
      }
    }, SpinnerAction.None, this.nicheMenuPopupContainer)
      .then((nicheMenuPopup: NicheMenuPopupComponent) => {
        this.nicheMenuPopupOpen = true;
        this.nicheMenuPopup = nicheMenuPopup;
        this.nicheMenuPopup.selectedNicheName = this.selectedNiche ? this.selectedNiche.name : 'All Niches';
        this.nicheMenuPopup.arrow = this.arrow;

        this.nicheMenuPopup.onNicheMenuItemClick
          .subscribe((niche: Niche) => {
            this.selectedNiche = niche;
          });

          const nicheMenuPopupCloseListener = this.nicheMenuPopup.onClose.subscribe(() => {
            nicheMenuPopupCloseListener.unsubscribe();
            this.nicheMenuPopupOpen = false;
          });
      });
  }



  async onProfilePicClick(): Promise<void> {
    if (this.accountMenuPopupOpen) {
      this.accountMenuPopup.close();
      return;
    }

    this.lazyLoadingService.load(async () => {
      const { AccountMenuPopupComponent } = await import('../../account-menu-popup/account-menu-popup.component');
      const { AccountMenuPopupModule } = await import('../../account-menu-popup/account-menu-popup.module');

      return {
        component: AccountMenuPopupComponent,
        module: AccountMenuPopupModule
      }
    }, SpinnerAction.None, this.accountMenuPopupContainer)
      .then((accountMenuPopup: AccountMenuPopupComponent) => {
        this.accountMenuPopupOpen = true;
        this.accountMenuPopup = accountMenuPopup;

        const accountMenuPopupCloseListener = this.accountMenuPopup.onClose.subscribe(() => {
          accountMenuPopupCloseListener.unsubscribe();
          this.accountMenuPopupOpen = false;
        });
      });
  }














  








  hideSuggestionList() {
    if (this.suggestionListMousedown) {
      this.suggestionListMousedown = false;
      return;
    }

    this.suggestions = [];
  }


  search(searchTerm: string, niche?: Niche) {
    let queryParams: Params;

    if (searchTerm == '') return;

    if (niche) {
      this.selectedNiche = niche;
    }

    if (this.selectedNiche.id == 'all') {
      queryParams = { search: searchTerm };
    } else {
      queryParams = {
        search: searchTerm,
        nicheId: this.selectedNiche.id,
        nicheName: this.selectedNiche.urlName
      }
    }


    this.router.navigate(['/search'], {
      queryParams: queryParams
    });
    this.suggestions = [];
  }


  onArrowPress(direction: number, input: HTMLInputElement) {
    this.suggestionIndex += direction;

    // Display the search words if the suggestionIndex is outside the bounds
    if (this.suggestions.length == 0 || this.suggestionIndex == -1 || this.suggestionIndex == this.suggestions.length) {
      input.value = this.searchTerm;
      return;
    }

    // This will cause the selection to loop
    if (this.suggestionIndex == -2) {
      this.suggestionIndex = this.suggestions.length - 1;
    } else if (this.suggestionIndex == this.suggestions.length + 1) {
      this.suggestionIndex = 0;
    }

    // Display the suggestion in the search input
    input.value = this.suggestions[this.suggestionIndex].name;

    // Set the niche in the niche dropdown if the suggestion has a niche
    if (this.suggestions.findIndex(x => x.niche) != -1) {
      if (this.suggestions[this.suggestionIndex].niche) {
        this.selectedNiche = this.suggestions[this.suggestionIndex].niche;
      } else {
        this.selectedNiche = this.nicheService.allNiche;
      }
    }
  }
}