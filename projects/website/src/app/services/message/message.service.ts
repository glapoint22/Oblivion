import { Injectable } from '@angular/core';
import { DataService } from 'common';
import { Observable, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private message!: string;
  private messageClosed!: boolean;

  constructor(private dataService: DataService) { }

  public getMessage(): Observable<string | null> {
    if (this.messageClosed) return of(null)

    if (this.message) {
      return of(this.message);
    }

    return this.dataService.get<string>('api/Message')
      .pipe(map((message: any) => {
        this.message = message.text;
        return this.message;
      }));
  }

  public closeMessage(): void {
    this.messageClosed = true;
  }
}