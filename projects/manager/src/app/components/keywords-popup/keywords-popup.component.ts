import { Component, ViewChild } from '@angular/core';
import { LazyLoad } from 'common';
import { AvailableKeywordsComponent } from '../available-keywords/available-keywords.component';
import { SelectedKeywordsComponent } from '../selected-keywords/selected-keywords.component';

@Component({
  selector: 'app-keywords-popup',
  templateUrl: './keywords-popup.component.html',
  styleUrls: ['./keywords-popup.component.scss']
})
export class KeywordsPopupComponent extends LazyLoad {
  public productId!: number;
  public productIndex!: number;
  @ViewChild('availableKeywords') availableKeywords!: AvailableKeywordsComponent;
  @ViewChild('selectedKeywords') selectedKeywords!: SelectedKeywordsComponent;
  

  ngAfterViewInit() {
    super.ngAfterViewInit();
    this.availableKeywords.onClose.subscribe(() => this.close());
  }


  onOpen(): void {
    this.availableKeywords.onOpen();
    this.selectedKeywords.onOpen();
  }

  onEscape(): void {
    this.availableKeywords.onEscape();
  }
}