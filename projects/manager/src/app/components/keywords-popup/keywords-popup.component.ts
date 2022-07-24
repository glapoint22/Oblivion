import { Component, ViewChild } from '@angular/core';
import { LazyLoad } from 'common';
import { AvailableKeywordsComponent } from '../available-keywords/available-keywords.component';

@Component({
  selector: 'app-keywords-popup',
  templateUrl: './keywords-popup.component.html',
  styleUrls: ['./keywords-popup.component.scss']
})
export class KeywordsPopupComponent extends LazyLoad { 
  @ViewChild('availableKeywords') availableKeywords!: AvailableKeywordsComponent;
  


  ngAfterViewInit() {
    super.ngAfterViewInit();
    this.availableKeywords.onClose.subscribe(() => this.close());
  }


  onOpen(): void {
    this.availableKeywords.onOpen();
  }

  onEscape(): void {
    this.availableKeywords.onEscape();
  }
}