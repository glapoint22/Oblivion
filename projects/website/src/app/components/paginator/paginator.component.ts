import { Component, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnChanges {
  @Input() public pageCount!: number;
  @Input() public currentPage!: number;
  @Input() public setScrollTo!: boolean;
  public pages!: Array<number>;

  constructor(private router: Router) { }

  ngOnChanges() {
    this.pages = [];

    this.pages.push(1);
    if (this.currentPage >= 4 && this.pageCount > 5) {
      this.pages.push(-1);

      if (this.pageCount - this.currentPage < 3) {
        for (let i = this.pageCount - 3; i < this.pageCount; i++) {
          this.pages.push(i);
        }
      } else {
        for (let i = this.currentPage - 1; i < Math.min(this.currentPage + 2, this.pageCount); i++) {
          this.pages.push(i);
        }
      }
      if (this.pageCount - this.currentPage > 2) this.pages.push(-1);
    } else {
      for (let i = 2; i <= Math.min(this.pageCount - 1, 4); i++) {
        this.pages.push(i);
      }
      if (this.pageCount > 5) this.pages.push(-1);
    }
    if (this.pageCount > 1) this.pages.push(this.pageCount);
  }


  setPage(page: number) {
    this.router.navigate([], {
      queryParams: { page: page, scrollTo: this.setScrollTo ? true : null },
      queryParamsHandling: 'merge'
    });
  }
}