import { Component, Input, OnInit } from '@angular/core';
import { DataService } from 'common';
import { Product } from '../../classes/product';
import { Query } from '../../classes/query';
import { QueryElement } from '../../classes/query-element';
import { QueryGroup } from '../../classes/query-group';
import { Queryable } from '../../classes/queryable';
import { QueryBuilderService } from '../../services/query-builder/query-builder.service';
import { WidgetService } from '../../services/widget/widget.service';

@Component({
  selector: 'query-builder',
  templateUrl: './query-builder.component.html',
  styleUrls: ['./query-builder.component.scss']
})
export class QueryBuilderComponent implements OnInit {
  @Input() widget!: Queryable;

  constructor(public queryBuilderService: QueryBuilderService, private dataService: DataService, private widgetService: WidgetService) { }


  // ---------------------------------------------------------------- Ng On Init -------------------------------------------------------------------
  public ngOnInit(): void {
    this.queryBuilderService.getQueryLists();
    this.queryBuilderService.change$.subscribe(() => {

      this.dataService.get<Array<Product>>('api/Products/QueryBuilder', [{key: 'queryString', value: this.widgetService.stringify(this.widget.query)}])
        .subscribe((products: Array<Product>) => {
          this.widget.products = products;
          this.widget.ngOnChanges();
        });
    });
  }




  // ----------------------------------------------------------- Is Group Icon Disabled ------------------------------------------------------------
  isGroupIconDisabled(): boolean {
    if (this.queryBuilderService.selectedQueryElements.length <= 1) return true;

    return !this.queryBuilderService.selectedQueryElements.every(x => x.parent == this.queryBuilderService.selectedQueryElements[0].parent);
  }







  // ---------------------------------------------------------- Is Ungroup Icon Disabled -----------------------------------------------------------
  isUngroupIconDisabled(): boolean {
    if (this.queryBuilderService.selectedQueryElements.length == 0) return true;

    return !this.queryBuilderService.selectedQueryElements.every(x => x.element instanceof QueryGroup);
  }







  // ------------------------------------------------------------------- Add Row -------------------------------------------------------------------
  public onAddRowClick(): void {
    const parent = this.queryBuilderService.selectedQueryElements[0].parent;

    parent.addRow();
    this.queryBuilderService.selectedQueryElements = [];
    this.queryBuilderService.onChange();
  }







  // -------------------------------------------------------------- On Group Click --------------------------------------------------------------
  public onGroupClick(): void {
    const parent = this.queryBuilderService.selectedQueryElements[0].parent;
    parent.createGroup();

    this.queryBuilderService.selectedQueryElements = [];
    this.queryBuilderService.onChange();
  }





  // ------------------------------------------------------------- On Ungroup Click -------------------------------------------------------------
  public onUngroupClick(): void {
    const elements = this.queryBuilderService.selectedQueryElements.filter((value, index, self) => {
      return self.findIndex(x => x.parent == value.parent) == index;
    });

    elements.forEach((element: QueryElement) => {
      element.parent.ungroupElements();
    });

    this.queryBuilderService.selectedQueryElements = [];
    this.queryBuilderService.onChange();
  }






  // ------------------------------------------------------------- On Delete Click --------------------------------------------------------------
  onDeleteClick() {
    const elements = this.queryBuilderService.selectedQueryElements.filter((value, index, self) => {
      return self.findIndex(x => x.parent == value.parent) == index;
    });

    elements.forEach((queryElement: QueryElement) => {
      queryElement.parent.deleteElements();
    });

    this.queryBuilderService.selectedQueryElements = [];


    if (this.widget.query.elements.length == 0) {
      this.widget.query = new Query();
    }

    this.queryBuilderService.onChange();
  }
}