import { Injectable, ViewContainerRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  public container!: ViewContainerRef;
}