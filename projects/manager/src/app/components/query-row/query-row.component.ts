import { KeyValue } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import { DropdownListComponent, DropdownListModule, DropdownType, LazyLoadingService, ListItem, SpinnerAction } from 'common';
import { AutoQueryType, ComparisonOperatorType, LogicalOperatorType, PopupArrowPosition, QueryType } from '../../classes/enums';
import { Item } from '../../classes/item';
import { QueryElement } from '../../classes/query-element';
import { QueryRow } from '../../classes/query-row';
import { QueryBuilderService } from '../../services/query-builder/query-builder.service';
import { PricePopupComponent } from '../price-popup/price-popup.component';

@Component({
  selector: 'query-row',
  templateUrl: './query-row.component.html',
  styleUrls: ['./query-row.component.scss']
})
export class QueryRowComponent implements OnChanges {
  @Input() queryElement!: QueryElement;
  public queryRow!: QueryRow;
  public QueryType = QueryType;
  public LogicalOperatorType = LogicalOperatorType;
  public AutoQueryType = AutoQueryType;

  constructor(private lazyLoadingService: LazyLoadingService, public queryBuilderService: QueryBuilderService) { }


  // ---------------------------------------------------------------- Ng On Changes ----------------------------------------------------------------
  public ngOnChanges(): void {
    this.queryRow = this.queryElement.element as QueryRow;
  }



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

      // Niche
      switch (queryType) {
        case QueryType.Niche:
          this.queryRow.item = this.queryBuilderService.nichesList[0];
          break;

        // Subniche
        case QueryType.Subniche:
          this.queryRow.item = this.queryBuilderService.subnichesList[0];
          break;

        // Product Group
        case QueryType.ProductGroup:
          this.queryRow.item = this.queryBuilderService.productGroupsList[0];
          break;


        // Price
        case QueryType.Price:
          this.queryRow.price = 0;
          break;


        // Rating
        case QueryType.Rating:
          this.queryRow.intValue = 1;
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

      this.queryBuilderService.onChange();
    });
  }




  // ------------------------------------------------------ On Comparison Operator Button Click ----------------------------------------------------
  onComparisonOperatorButtonClick(comparisonOperatorButton: HTMLElement) {
    if (this.queryRow.queryType != QueryType.Price &&
      this.queryRow.queryType != QueryType.Rating &&
      this.queryRow.queryType != QueryType.Date) return;

    this.openDropdownList(comparisonOperatorButton, this.queryBuilderService.comparisonOperatorList, (item: KeyValue<string, ComparisonOperatorType>) => {
      this.queryRow.comparisonOperatorType = item.value;
      this.queryBuilderService.onChange();
    });
  }




  // ------------------------------------------------------------ On Value Button Click ------------------------------------------------------------
  onValueButtonClick(valueButton: HTMLElement) {
    switch (this.queryRow.queryType) {

      // Niche
      case QueryType.Niche:
        this.openDropdownList(valueButton, this.queryBuilderService.nichesList, (item: Item) => {
          this.queryRow.item = item;
          this.queryBuilderService.onChange();
        });
        break;


      // Subniche
      case QueryType.Subniche:
        this.openDropdownList(valueButton, this.queryBuilderService.subnichesList, (item: Item) => {
          this.queryRow.item = item;
          this.queryBuilderService.onChange();
        });
        break;


      // Product Group
      case QueryType.ProductGroup:
        this.openDropdownList(valueButton, this.queryBuilderService.productGroupsList, (item: Item) => {
          this.queryRow.item = item;
          this.queryBuilderService.onChange();
        });
        break;


      // Price
      case QueryType.Price:
        this.openPricePopup(valueButton);
        break;


      // Rating
      case QueryType.Rating:
        this.openDropdownList(valueButton, this.queryBuilderService.ratingList, (item: KeyValue<string, number>) => {
          this.queryRow.intValue = item.value;
          this.queryBuilderService.onChange();
        });
        break;


      // Keyword Group
      case QueryType.KeywordGroup:
        this.openDropdownList(valueButton, this.queryBuilderService.keywordGroupsList, (item: ListItem) => {
          this.queryRow.item = item;
          this.queryBuilderService.onChange();
        });
        break;



      // Auto
      case QueryType.Auto:
        this.openDropdownList(valueButton, this.queryBuilderService.autoQueryTypeList, (item: KeyValue<string, AutoQueryType>) => {
          this.queryRow.auto = item.value;
          this.queryBuilderService.onChange();
        });
        break;
    }
  }



  // ------------------------------------------------------- On Logical Operator Button Click ------------------------------------------------------
  onLogicalOperatorButtonClick(logicalOperatorButton: HTMLElement) {
    this.openDropdownList(logicalOperatorButton, this.queryBuilderService.logicalOperatorTypeList, (item: KeyValue<string, LogicalOperatorType>) => {
      this.queryRow.logicalOperatorType = item.value;
      this.queryBuilderService.onChange();
    });
  }



  // ---------------------------------------------------------------- Clear Value ------------------------------------------------------------------
  clearValue(): void {
    this.queryRow.item = null!;
    this.queryRow.intValue = null!;
    this.queryRow.date = null!;
    this.queryRow.price = null!;
    this.queryRow.auto = null!;
  }



  // -------------------------------------------------------------- load Dropdown List -------------------------------------------------------------
  openDropdownList<T extends ListItem | KeyValue<any, any>>(element: HTMLElement, list: Array<T>, callback: Function) {
    this.lazyLoadingService.load<DropdownListComponent<T>, DropdownListModule>(async () => {
      const { DropdownListComponent } = await import('common');
      const { DropdownListModule } = await import('common');
      return {
        component: DropdownListComponent,
        module: DropdownListModule
      }
    }, SpinnerAction.None)
      .then((dropdownList: DropdownListComponent<T>) => {
        const elementRect = element.getBoundingClientRect();
        dropdownList.dropdownType = DropdownType.Manager;
        dropdownList.list = list;
        dropdownList.top = elementRect.top + elementRect.height;
        dropdownList.left = elementRect.left;
        dropdownList.width = elementRect.width;

        dropdownList.onArrowSelect = (text: string) => {
          element.firstElementChild!.innerHTML = text;
        }

        dropdownList.onItemSubmit = callback;
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
        pricePopup.arrowPosition = PopupArrowPosition.TopRight;
        pricePopup.price = this.queryRow.price!;
        pricePopup.top = elementRect.top + elementRect.height - 38;
        pricePopup.left = elementRect.left - 292;

        pricePopup.callback = (price: number) => {
          this.queryRow.price = price;
          this.queryBuilderService.onChange();
        }
      });
  }




  // ---------------------------------------------------------------- On Date Change ---------------------------------------------------------------
  onDateChange(dateInput: HTMLInputElement) {
    const milliseconds = new Date(1970, 0, 1).setMilliseconds(Date.parse(dateInput.value));

    this.queryRow.date = new Date(milliseconds);
    this.queryBuilderService.onChange();
  }



  // ---------------------------------------------------------------- Get Item Name ---------------------------------------------------------------
  getItemName(): string {
    let name!: string;

    if (!this.queryBuilderService.listsDownloadComplete) return null!;

    if (this.queryRow.item) {
      if (!this.queryRow.item.name) {
        switch (this.queryRow.queryType) {

          // Niche
          case QueryType.Niche:
            name = this.queryBuilderService.nichesList.find(x => x.id == this.queryRow.item?.id)?.name!;
            break;

          // Subniche
          case QueryType.Subniche:
            name = this.queryBuilderService.subnichesList.find(x => x.id == this.queryRow.item?.id)?.name!;
            break;

          // Keyword Group
          case QueryType.KeywordGroup:
            name = this.queryBuilderService.keywordGroupsList.find(x => x.id == this.queryRow.item?.id)?.name!;
            break;


          // Product Group
          case QueryType.ProductGroup:
            name = this.queryBuilderService.productGroupsList.find(x => x.id == this.queryRow.item?.id)?.name!;
            break;
        }

        this.queryRow.item.name = name;
      } else {
        name = this.queryRow.item.name;
      }
    }

    return name;
  }
}