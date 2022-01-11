import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GridData } from '../../classes/grid-data';

@Component({
  selector: 'grid-widget',
  templateUrl: './grid-widget.component.html',
  styleUrls: ['./grid-widget.component.scss']
})
export class GridWidgetComponent {
  @Input() gridData!: GridData;

  constructor(public route: ActivatedRoute, private router: Router) { }


  clearFilters() {
    this.router.navigate([], {
      queryParams: { filters: null },
      queryParamsHandling: 'merge'
    });
  }


  getPageNumber() {
    return this.route.snapshot.queryParams.page ? parseInt(this.route.snapshot.queryParams.page) : 1;
  }

}
