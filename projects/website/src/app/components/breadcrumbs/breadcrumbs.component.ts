import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Breadcrumb } from '../../classes/breadcrumb';
import { LazyLoadingService } from 'common';

@Component({
  selector: 'breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent {
  @Input() top!: number;
  @Input() breadcrumbs!: Array<Breadcrumb>;
  @ViewChild('breadcrumbContainer') private breadcrumbContainer!: ElementRef<HTMLElement>;

  constructor(public lazyLoadingService: LazyLoadingService) { }

  // Height
  public get height(): number {
    return this.breadcrumbContainer ? this.breadcrumbContainer.nativeElement.clientHeight : 0;
  }
}