import { Component, ViewChild } from '@angular/core';
import { LazyLoad } from 'common';
import { Subject } from 'rxjs';
import { AvailableKeywordsComponent } from '../../../../available-keywords/available-keywords.component';
import { SelectedKeywordsComponent } from '../../../../selected-keywords/selected-keywords.component';

@Component({
  selector: 'app-keywords-popup',
  templateUrl: './keywords-popup.component.html',
  styleUrls: ['./keywords-popup.component.scss']
})
export class KeywordsPopupComponent extends LazyLoad {
  public productId!: number;
  public productIndex!: number;
  public onClose: Subject<void> = new Subject<void>();
  @ViewChild('availableKeywords') availableKeywords!: AvailableKeywordsComponent;
  @ViewChild('selectedKeywords') selectedKeywords!: SelectedKeywordsComponent;


  ngOnInit() {
    super.ngOnInit();
    window.addEventListener('mousedown', this.mousedown);
  }


  mousedown = () => {
    this.close();
  }
  

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


  close(): void {
    super.close();
    this.onClose.next();
  }


  ngOnDestroy() {
    window.removeEventListener('mousedown', this.mousedown);
  }
}