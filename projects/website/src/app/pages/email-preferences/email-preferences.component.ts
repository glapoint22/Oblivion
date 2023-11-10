import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService, LazyLoadingService, SpinnerAction } from 'common';
import { EmailPreferences } from '../../classes/email-preferences';
import { SuccessPromptComponent } from '../../components/success-prompt/success-prompt.component';
import { Breadcrumb } from '../../classes/breadcrumb';
import { Subscription } from 'rxjs';

@Component({
  selector: 'email-preferences',
  templateUrl: './email-preferences.component.html',
  styleUrls: ['./email-preferences.component.scss']
})
export class EmailPreferencesComponent implements OnInit {
  public preferences!: EmailPreferences;
  private initialPreferences: EmailPreferences = new EmailPreferences();
  public allChecked!: boolean;
  public breadcrumbs!: Array<Breadcrumb>;
  private dataServicePutSubscription!: Subscription;

  constructor
    (
      private dataService: DataService,
      public lazyLoadingService: LazyLoadingService,
      private route: ActivatedRoute
    ) { }

  ngOnInit() {
    this.preferences = this.route.snapshot.data.preferences;
    this.setInitialPreferences();
    this.setAllChecked();

    // Set the breadcrumbs
    this.breadcrumbs = [
      {
        link: {
          name: 'Your Account',
          route: '/account'
        }
      },
      {
        active: 'Email Preferences'
      }
    ]
  }

  

  isDisabled() {
    if (!this.preferences) return true;

    const keys: Array<keyof EmailPreferences> = Object.keys(this.preferences) as Array<keyof EmailPreferences>;

    for (let i = 0; i < keys.length; i++) {
      if (this.preferences[keys[i]] != this.initialPreferences[keys[i]]) return false;
    }

    return true;
  }


  setAllChecked() {
    this.allChecked = !(Object.values(this.preferences).some(x => x == false));
  }

  toggleAllChecked() {
    const keys: Array<keyof EmailPreferences> = Object.keys(this.preferences) as Array<keyof EmailPreferences>;

    keys.forEach(key => {
      this.preferences[key] = this.allChecked;
    })
  }



  onSaveChangesClick() {
    this.dataServicePutSubscription = this.dataService.put('api/EmailPreferences', this.preferences, {
      authorization: true,
      spinnerAction: SpinnerAction.Start
    }).subscribe(() => {
      this.setInitialPreferences();
      this.OpenSuccessPrompt();
    });
  }


  setInitialPreferences() {
    const preferencesKeys: Array<keyof EmailPreferences> = Object.keys(this.preferences) as Array<keyof EmailPreferences>;

    preferencesKeys.forEach(key => {
      this.initialPreferences[key] = this.preferences[key];
      if (!this.initialPreferences[key]) this.allChecked = false;
    });
  }


  async OpenSuccessPrompt() {
    this.lazyLoadingService.load(async () => {
      const { SuccessPromptComponent } = await import('../../components/success-prompt/success-prompt.component');
      const { SuccessPromptModule } = await import('../../components/success-prompt/success-prompt.module');

      return {
        component: SuccessPromptComponent,
        module: SuccessPromptModule
      }
    }, SpinnerAction.End)
      .then((successPromptComponent: SuccessPromptComponent) => {
        successPromptComponent.header = 'Email Preferences';
        successPromptComponent.message = 'Your email preferences have been successfully updated.';
      });
  }



  ngOnDestroy() {
    if (this.dataServicePutSubscription) this.dataServicePutSubscription.unsubscribe();
  }
}