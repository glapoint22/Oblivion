import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  public spinnerState: Subject<boolean> = new Subject<boolean>();



  private _show!: boolean;
  public get show(): boolean {
    return this._show;
  }
  public set show(v: boolean) {
    this.spinnerState.next(v);
    this._show = v;
  }


  constructor() { }
}
