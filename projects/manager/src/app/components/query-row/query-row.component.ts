import { KeyValue } from '@angular/common';
import { Component, Input } from '@angular/core';
import { LazyLoadingService, SpinnerAction } from 'common';
import { AutoQueryType, ComparisonOperatorType, LogicalOperatorType, QueryType } from '../../classes/enums';
import { Item } from '../../classes/item';
import { QueryRow } from '../../classes/query-row';
import { SelectableQueryRow } from '../../classes/selectable-query-row';
import { QueryBuilderService } from '../../services/query-builder/query-builder.service';
import { DropdownListComponent } from '../dropdown-list/dropdown-list.component';
import { DropdownListModule } from '../dropdown-list/dropdown-list.module';
import { PricePopupComponent } from '../price-popup/price-popup.component';
import { QueryComponent } from '../query/query.component';

@Component({
  selector: 'query-row',
  templateUrl: './query-row.component.html',
  styleUrls: ['./query-row.component.scss']
})
export class QueryRowComponent implements SelectableQueryRow {
  @Input() queryRow!: QueryRow;
  @Input() parentQuery!: QueryComponent;
  public QueryType = QueryType;
  public LogicalOperatorType = LogicalOperatorType;
  public AutoQueryType = AutoQueryType;
  public get selected() : boolean {
    return this.queryRow.selected!;
  }
  public set selected(v : boolean) {
    this.queryRow.selected = v;
  }

  constructor(private lazyLoadingService: LazyLoadingService, public queryBuilderService: QueryBuilderService) { }

  // ----------------------------------------------------------- Get Comparison Operator -----------------------------------------------------------
  public getComparisonOperator(comparisonOperatorType: ComparisonOperatorType): string {
    let comparisonOperator!: string;

    switch (comparisonOperatorType) {
      case ComparisonOperatorType.NotEqual:
        comparisonOperator = '!=';
        break;

      case ComparisonOperatorType.GreaterThan:
        comparisonOperator = '>';
        break;

      case ComparisonOperatorType.GreaterThanOrEqual:
        comparisonOperator = '>=';
        break;

      case ComparisonOperatorType.LessThan:
        comparisonOperator = '<';
        break;

      case ComparisonOperatorType.LessThanOrEqual:
        comparisonOperator = '<=';
        break;

      default:
        comparisonOperator = '=';
        break;
    }

    return comparisonOperator;
  }




  // ---------------------------------------------------------- On Query Type Button Click ---------------------------------------------------------
  public onQueryTypeButtonClick(queryTypeButton: HTMLElement): void {
    this.openDropdownList(queryTypeButton, this.queryBuilderService.queryTypeList, (item: KeyValue<string, QueryType>) => {
      const queryType = item.value;

      this.queryRow.queryType = queryType;
      this.clearValue();

      this.queryRow.comparisonOperatorType = ComparisonOperatorType.Equal;

      // Category
      switch (queryType) {
        case QueryType.Category:
          this.queryRow.item = this.queryBuilderService.categoriesList[0];
          break;

        // Niche
        case QueryType.Niche:
          this.queryRow.item = this.queryBuilderService.nichesList[0];
          break;

        // Subgroup
        case QueryType.Subgroup:
          this.queryRow.item = this.queryBuilderService.subgroupsList[0];
          break;


        // Price
        case QueryType.Price:
          this.queryRow.price = 0;
          break;


        // Rating
        case QueryType.Rating:
          this.queryRow.integer = 1;
          break;


        // Keyword Group
        case QueryType.KeywordGroup:
          this.queryRow.item = this.queryBuilderService.keywordGroupsList[0];
          break;


        // Date
        case QueryType.Date:
          this.queryRow.date = new Date();
          break;


        // Auto
        case QueryType.Auto:
          this.queryRow.auto = AutoQueryType.Browsed;
          break;
      }
    });
  }




  // ------------------------------------------------------ On Comparison Operator Button Click ----------------------------------------------------
  onComparisonOperatorButtonClick(comparisonOperatorButton: HTMLElement) {
    if (this.queryRow.queryType != QueryType.Price &&
      this.queryRow.queryType != QueryType.Rating &&
      this.queryRow.queryType != QueryType.Date) return;

    this.openDropdownList(comparisonOperatorButton, this.queryBuilderService.comparisonOperatorList, (item: KeyValue<string, ComparisonOperatorType>) => {
      this.queryRow.comparisonOperatorType = item.value;
    });
  }




  // ------------------------------------------------------------ On Value Button Click ------------------------------------------------------------
  onValueButtonClick(valueButton: HTMLElement) {
    switch (this.queryRow.queryType) {

      // Category
      case QueryType.Category:
        this.openDropdownList(valueButton, this.queryBuilderService.categoriesList, (item: Item) => {
          this.queryRow.item = item;
        });
        break;


      // Niche
      case QueryType.Niche:
        this.openDropdownList(valueButton, this.queryBuilderService.nichesList, (item: Item) => {
          this.queryRow.item = item;
        });
        break;


      // Subgroup
      case QueryType.Subgroup:
        this.openDropdownList(valueButton, this.queryBuilderService.subgroupsList, (item: Item) => {
          this.queryRow.item = item;
        });
        break;


      // Price
      case QueryType.Price:
        this.openPricePopup(valueButton);
        break;


      // Rating
      case QueryType.Rating:
        this.openDropdownList(valueButton, this.queryBuilderService.ratingList, (item: KeyValue<string, number>) => {
          this.queryRow.integer = item.value;
        });
        break;


      // Keyword Group
      case QueryType.KeywordGroup:
        this.openDropdownList(valueButton, this.queryBuilderService.keywordGroupsList, (item: Item) => {
          this.queryRow.item = item;
        });
        break;



      // Date
      case QueryType.Date:
        // Load date popup
        break;


      // Auto
      case QueryType.Auto:
        this.openDropdownList(valueButton, this.queryBuilderService.autoQueryTypeList, (item: KeyValue<string, AutoQueryType>) => {
          this.queryRow.auto = item.value;
        });
        break;
    }
  }



  // ------------------------------------------------------- On Logical Operator Button Click ------------------------------------------------------
  onLogicalOperatorButtonClick(logicalOperatorButton: HTMLElement) {
    this.openDropdownList(logicalOperatorButton, this.queryBuilderService.logicalOperatorTypeList, (item: KeyValue<string, LogicalOperatorType>) => {
      this.queryRow.logicalOperatorType = item.value;
    });
  }



  // ---------------------------------------------------------------- Clear Value ------------------------------------------------------------------
  clearValue(): void {
    this.queryRow.item = null!;
    this.queryRow.integer = null!;
    this.queryRow.date = null!;
    this.queryRow.price = null!;
    this.queryRow.auto = null!;
  }



  // -------------------------------------------------------------- load Dropdown List -------------------------------------------------------------
  openDropdownList<T extends Item | KeyValue<any, any>>(element: HTMLElement, list: Array<T>, callback: Function) {
    this.lazyLoadingService.load<DropdownListComponent<T>, DropdownListModule>(async () => {
      const { DropdownListComponent } = await import('../dropdown-list/dropdown-list.component');
      const { DropdownListModule } = await import('../dropdown-list/dropdown-list.module');
      return {
        component: DropdownListComponent,
        module: DropdownListModule
      }
    }, SpinnerAction.None)
      .then((dropdownList: DropdownListComponent<T>) => {
        const elementRect = element.getBoundingClientRect();

        dropdownList.list = list;
        dropdownList.top = elementRect.top + elementRect.height;
        dropdownList.left = elementRect.left;
        dropdownList.width = elementRect.width;

        dropdownList.onArrowSelect = (text: string) => {
          element.firstElementChild!.innerHTML = text;
        }

        dropdownList.callback = callback;
      });
  }




  // --------------------------------------------------------------- Open Price Popup --------------------------------------------------------------
  openPricePopup(element: HTMLElement) {
    this.lazyLoadingService.load(async () => {
      const { PricePopupComponent } = await import('../price-popup/price-popup.component');
      const { PricePopupModule } = await import('../price-popup/price-popup.module');
      return {
        component: PricePopupComponent,
        module: PricePopupModule
      }
    }, SpinnerAction.None)
      .then((pricePopup: PricePopupComponent) => {
        const elementRect = element.getBoundingClientRect();

        pricePopup.price = this.queryRow.price!;
        pricePopup.top = elementRect.top + elementRect.height - 38;
        pricePopup.left = elementRect.left - 292;

        pricePopup.callback = (price: number) => {
          this.queryRow.price = price;
        }
      });
  }



  // ---------------------------------------------------------------- On Date Change ---------------------------------------------------------------
  onDateChange(dateInput: HTMLInputElement) {
    const milliseconds = new Date(1970, 0, 1).setMilliseconds(Date.parse(dateInput.value));

    this.queryRow.date = new Date(milliseconds);
  }
}