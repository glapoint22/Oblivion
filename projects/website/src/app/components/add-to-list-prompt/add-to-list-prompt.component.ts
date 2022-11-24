import { KeyValue } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoad, LazyLoadingService, SummaryProduct } from 'common';

@Component({
  selector: 'add-to-list-prompt',
  templateUrl: './add-to-list-prompt.component.html',
  styleUrls: ['./add-to-list-prompt.component.scss']
})
export class AddToListPromptComponent extends LazyLoad {
  public list!: KeyValue<string, string>;
  public product!: SummaryProduct;

  constructor
    (
      lazyLoadingService: LazyLoadingService,
      private router: Router
    ) { super(lazyLoadingService) }


  ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.setFocus(0);
  }


  onViewList() {
    this.router.navigate(['account', 'lists', this.list.value]);
    this.close();
  }


  onSpace(e: KeyboardEvent): void {
    e.preventDefault();
  }
}