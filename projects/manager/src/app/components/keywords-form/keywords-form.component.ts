import { Component, ViewChild } from '@angular/core';
import { LazyLoad } from 'common';
import { FormKeywordsComponent } from '../form-keywords/form-keywords.component';

@Component({
  selector: 'keywords-form',
  templateUrl: './keywords-form.component.html',
  styleUrls: ['./keywords-form.component.scss']
})
export class KeywordsFormComponent extends LazyLoad {
  @ViewChild('formKeywords') formKeywords!: FormKeywordsComponent;
  


  ngAfterViewInit() {
    super.ngAfterViewInit();
    this.formKeywords.onClose.subscribe(() => this.close());
  }


  onOpen(): void {
    this.formKeywords.onOpen();
  }

  onEscape(): void {
    this.formKeywords.onEscape();
  }
}