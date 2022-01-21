import { Injectable } from '@angular/core';
import {
  Resolve
} from '@angular/router';
import { Observable } from 'rxjs';
import { EmailPreferences } from '../../classes/email-preferences';
import { DataService } from '../../services/data/data.service';

@Injectable({
  providedIn: 'root'
})
export class EmailPreferencesResolver implements Resolve<EmailPreferences> {

  constructor(private dataService: DataService) { }

  resolve(): Observable<EmailPreferences> {
    return this.dataService.get<EmailPreferences>('api/EmailPreferences', undefined, { authorization: true });
  }
}