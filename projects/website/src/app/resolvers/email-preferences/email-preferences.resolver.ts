import { Injectable } from '@angular/core';
import {
  Resolve
} from '@angular/router';
import { DataService } from 'common';
import { Observable } from 'rxjs';
import { EmailPreferences } from '../../classes/email-preferences';

@Injectable({
  providedIn: 'root'
})
export class EmailPreferencesResolver implements Resolve<EmailPreferences> {

  constructor(private dataService: DataService) { }

  resolve(): Observable<EmailPreferences> {
    return this.dataService.get<EmailPreferences>('api/EmailPreferences', undefined, { authorization: true });
  }
}