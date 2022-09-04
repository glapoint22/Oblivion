import { KeyValue } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LazyLoadingService, SpinnerAction } from 'common';
import { QueryItem } from 'dist/widgets/lib/classes/query-item';
import { AutoQueryType, ComparisonOperatorType, LogicalOperatorType, Query, QueryGroup, QueryRow, QueryType } from 'widgets';
import { Item } from '../../classes/item';
import { DropdownListComponent } from '../dropdown-list/dropdown-list.component';
import { DropdownListModule } from '../dropdown-list/dropdown-list.module';
import { PricePopupComponent } from '../price-popup/price-popup.component';

@Component({
  selector: 'query-row',
  templateUrl: './query-row.component.html',
  styleUrls: ['./query-row.component.scss']
})
export class QueryRowComponent {
  @Input() queryRow!: QueryRow;
  @Input() query!: Query;
  @Output() onRowSelectionChange: EventEmitter<QueryRow> = new EventEmitter();
  @Output() onGroupSelectionChange: EventEmitter<QueryGroup> = new EventEmitter();
  public QueryType = QueryType;
  public LogicalOperatorType = LogicalOperatorType;
  public AutoQueryType = AutoQueryType;
  public queryTypeList: Array<KeyValue<string, QueryType>> = [
    {
      key: 'None',
      value: QueryType.None
    },
    {
      key: 'Category',
      value: QueryType.Category
    },
    {
      key: 'Niche',
      value: QueryType.Niche
    },
    {
      key: 'Subgroup',
      value: QueryType.Subgroup
    },
    {
      key: 'Price',
      value: QueryType.Price
    },
    {
      key: 'Rating',
      value: QueryType.Rating
    },
    {
      key: 'Keyword Group',
      value: QueryType.KeywordGroup
    },
    {
      key: 'Date',
      value: QueryType.Date
    },
    {
      key: 'Auto',
      value: QueryType.Auto
    }
  ];



  public comparisonOperatorList: Array<KeyValue<string, ComparisonOperatorType>> = [
    {
      key: '=',
      value: ComparisonOperatorType.Equal
    },
    {
      key: '!=',
      value: ComparisonOperatorType.NotEqual
    },
    {
      key: '>',
      value: ComparisonOperatorType.GreaterThan
    },
    {
      key: '>=',
      value: ComparisonOperatorType.GreaterThanOrEqual
    },
    {
      key: '<',
      value: ComparisonOperatorType.LessThan
    },
    {
      key: '<=',
      value: ComparisonOperatorType.LessThanOrEqual
    }
  ];




  public autoQueryTypeList: Array<KeyValue<string, AutoQueryType>> = [
    {
      key: 'Browsed',
      value: AutoQueryType.Browsed
    },
    {
      key: 'Related',
      value: AutoQueryType.Related
    },
    {
      key: 'Related Bought',
      value: AutoQueryType.RelatedBought
    },
    {
      key: 'Related Browsed',
      value: AutoQueryType.RelatedBrowsed
    },
    {
      key: 'Related Wishlist',
      value: AutoQueryType.RelatedWishlist
    }
  ];



  public logicalOperatorTypeList: Array<KeyValue<string, LogicalOperatorType>> = [
    {
      key: 'And',
      value: LogicalOperatorType.And
    },
    {
      key: 'Or',
      value: LogicalOperatorType.Or
    }
  ];


  public ratingList: Array<KeyValue<string, number>> = [
    {
      key: '1',
      value: 1
    },
    {
      key: '2',
      value: 2
    },
    {
      key: '3',
      value: 3
    },
    {
      key: '4',
      value: 4
    },
    {
      key: '5',
      value: 5
    }
  ];


  public categoriesList: Array<QueryItem> = [
    {
      id: 1,
      name: 'Health & Fitness'
    },
    {
      id: 2,
      name: 'Business & Investing'
    }
  ]


  public nichesList: Array<QueryItem> = [
    {
      id: 1,
      name: 'Diets & Weightloss'
    },
    {
      id: 2,
      name: 'Food & beverage'
    }
  ]



  public keywordGroupsList: Array<QueryItem> = [
    {
      id: 1,
      name: 'Trumpy'
    },
    {
      id: 2,
      name: 'Musky'
    },
    {
      id: 3,
      name: 'Alita'
    },
    {
      id: 4,
      name: 'Stargate'
    },
    {
      id: 5,
      name: 'Game Of Thrones'
    }
  ]




  public subgroupsList: Array<QueryItem> = [
    {
      id: 1,
      name: 'Ex'
    },
    {
      id: 2,
      name: 'Butt'
    }
  ]

  constructor(private lazyLoadingService: LazyLoadingService) { }


  ngOnChanges() {
    this.queryRow.query = this.query;
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
    this.openDropdownList(queryTypeButton, this.queryTypeList, (item: KeyValue<string, QueryType>) => {
      const queryType = item.value;

      this.queryRow.queryType = queryType;
      this.clearValue();

      // Category
      switch (queryType) {
        case QueryType.Category:
          this.queryRow.comparisonOperatorType = ComparisonOperatorType.Equal;
          this.queryRow.item = this.categoriesList[0];
          break;

        // Niche
        case QueryType.Niche:
          this.queryRow.comparisonOperatorType = ComparisonOperatorType.Equal;
          this.queryRow.item = this.nichesList[0];
          break;

        // Subgroup
        case QueryType.Subgroup:
          this.queryRow.comparisonOperatorType = ComparisonOperatorType.Equal;
          this.queryRow.item = this.subgroupsList[0];
          break;


        // Price
        case QueryType.Price:
          this.queryRow.comparisonOperatorType = ComparisonOperatorType.Equal;
          this.queryRow.price = 0;
          break;


        // Rating
        case QueryType.Rating:
          this.queryRow.comparisonOperatorType = ComparisonOperatorType.Equal;
          this.queryRow.integer = 1;
          break;


        // Keyword Group
        case QueryType.KeywordGroup:
          this.queryRow.comparisonOperatorType = ComparisonOperatorType.Equal;
          this.queryRow.item = this.keywordGroupsList[0];
          break;


        // Date
        case QueryType.Date:
          this.queryRow.comparisonOperatorType = ComparisonOperatorType.Equal;
          this.queryRow.date = new Date();
          break;


        // Auto
        case QueryType.Auto:
          this.queryRow.comparisonOperatorType = ComparisonOperatorType.Equal;
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

    this.openDropdownList(comparisonOperatorButton, this.comparisonOperatorList, (item: KeyValue<string, ComparisonOperatorType>) => {
      this.queryRow.comparisonOperatorType = item.value;
    });
  }




  // ------------------------------------------------------------ On Value Button Click ------------------------------------------------------------
  onValueButtonClick(valueButton: HTMLElement) {
    switch (this.queryRow.queryType) {

      // Category
      case QueryType.Category:
        this.openDropdownList(valueButton, this.categoriesList, (item: QueryItem) => {
          this.queryRow.item = item;
        });
        break;


      // Niche
      case QueryType.Niche:
        this.openDropdownList(valueButton, this.nichesList, (item: QueryItem) => {
          this.queryRow.item = item;
        });
        break;


      // Subgroup
      case QueryType.Subgroup:
        this.openDropdownList(valueButton, this.subgroupsList, (item: QueryItem) => {
          this.queryRow.item = item;
        });
        break;


      // Price
      case QueryType.Price:
        this.openPricePopup(valueButton);
        break;


      // Rating
      case QueryType.Rating:
        this.openDropdownList(valueButton, this.ratingList, (item: KeyValue<string, number>) => {
          this.queryRow.integer = item.value;
        });
        break;


      // Keyword Group
      case QueryType.KeywordGroup:
        this.openDropdownList(valueButton, this.keywordGroupsList, (item: QueryItem) => {
          this.queryRow.item = item;
        });
        break;



      // Date
      case QueryType.Date:
        // Load date popup
        break;


      // Auto
      case QueryType.Auto:
        this.openDropdownList(valueButton, this.autoQueryTypeList, (item: KeyValue<string, AutoQueryType>) => {
          this.queryRow.auto = item.value;
        });
        break;
    }
  }



  // ------------------------------------------------------- On Logical Operator Button Click ------------------------------------------------------
  onLogicalOperatorButtonClick(logicalOperatorButton: HTMLElement) {
    this.openDropdownList(logicalOperatorButton, this.logicalOperatorTypeList, (item: KeyValue<string, LogicalOperatorType>) => {
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





  // ----------------------------------------------------------------- On Row Click ----------------------------------------------------------------
  onRowClick(row: QueryRow) {
    if (this.query.queryGroup?.selected) return;

    row.selected = !row.selected;
    this.onRowSelectionChange.emit(row);
  }
}