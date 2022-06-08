import { Component, ViewChild } from '@angular/core';
import { LazyLoad } from 'common';
import { FormFiltersComponent } from '../form-filters/form-filters.component';

@Component({
  selector: 'keywords-form',
  templateUrl: './keywords-form.component.html',
  styleUrls: ['./keywords-form.component.scss']
})
export class KeywordsFormComponent extends LazyLoad {
  @ViewChild('formKeywords') formKeywords!: FormFiltersComponent;
  


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