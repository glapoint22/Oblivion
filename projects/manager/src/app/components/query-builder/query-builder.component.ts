import { Component, OnInit } from '@angular/core';
import { LazyLoadingService } from 'common';
import { AutoQueryType, ComparisonOperatorType, LogicalOperatorType, Query, QueryRow, QueryType } from 'widgets';

@Component({
  selector: 'query-builder',
  templateUrl: './query-builder.component.html',
  styleUrls: ['./query-builder.component.scss']
})
export class QueryBuilderComponent implements OnInit {
  // public queryTypeList!: Array<Item>;
  // public operatorList!: Array<Item>;
  // public logicalOperatorList!: Array<Item>;
  public query: Query = {
    queryRows: [
      {
        queryGroup: {
          query: {
            queryRows: [
              {
                queryType: QueryType.Price,
                comparisonOperatorType: ComparisonOperatorType.Equal,
                price: 5.99
              },
              {
                logicalOperatorType: LogicalOperatorType.And
              },
              {
                queryType: QueryType.Date,
                comparisonOperatorType: ComparisonOperatorType.GreaterThan,
                date: new Date('09/01/2022')
              }
            ]
          }
        }
      },
      {
        logicalOperatorType: LogicalOperatorType.Or
      },
      {
        queryGroup: {
          query: {
            queryRows: [
              {
                queryType: QueryType.Niche,
                comparisonOperatorType: ComparisonOperatorType.Equal,
                item: {
                  id: 2,
                  name: 'Recipes'
                }
              },
              {
                logicalOperatorType: LogicalOperatorType.And
              },
              {
                queryType: QueryType.Rating,
                comparisonOperatorType: ComparisonOperatorType.GreaterThanOrEqual,
                integer: 3
              }
            ]
          }
        }
      }
    ]
  }

  constructor(private lazyLoadingService: LazyLoadingService) { }

  ngOnInit(): void {
    // this.queryTypeList = [
    //   {
    //     id: QueryType.None,
    //     name: 'None',
    //   },
    //   {
    //     id: QueryType.Category,
    //     name: 'Category',
    //   },
    //   {
    //     id: QueryType.Niche,
    //     name: 'Niche',
    //   },
    //   {
    //     id: QueryType.ProductSubgroup,
    //     name: 'Subgroup',
    //   },
    //   {
    //     id: QueryType.ProductPrice,
    //     name: 'Price',
    //   },
    //   {
    //     id: QueryType.ProductRating,
    //     name: 'Rating',
    //   },
    //   {
    //     id: QueryType.ProductKeywords,
    //     name: 'Keywords',
    //   },
    //   {
    //     id: QueryType.ProductCreationDate,
    //     name: 'Date',
    //   },
    //   {
    //     id: QueryType.Auto,
    //     name: 'Auto',
    //   }
    // ];



    // this.operatorList = [
    //   {
    //     id: ComparisonOperatorType.Equal,
    //     name: '='
    //   },
    //   {
    //     id: ComparisonOperatorType.NotEqual,
    //     name: '!='
    //   },
    //   {
    //     id: ComparisonOperatorType.GreaterThan,
    //     name: '>'
    //   },
    //   {
    //     id: ComparisonOperatorType.GreaterThanOrEqual,
    //     name: '>='
    //   },
    //   {
    //     id: ComparisonOperatorType.LessThan,
    //     name: '<'
    //   },
    //   {
    //     id: ComparisonOperatorType.LessThanOrEqual,
    //     name: '<='
    //   }
    // ];



    // this.logicalOperatorList = [
    //   {
    //     id: LogicalOperatorType.And,
    //     name: 'And'
    //   },
    //   {
    //     id: LogicalOperatorType.Or,
    //     name: 'Or'
    //   }
    // ];

  }


  // ----------------------------------------------------- Show Dropdown List -----------------------------------------------------
  // showDropdownList(element: HTMLElement, list: Array<Item>) {
  //   this.lazyLoadingService.load<DropdownListComponent<Item>, DropdownListModule>(async () => {
  //     const { DropdownListComponent } = await import('../dropdown-list/dropdown-list.component');
  //     const { DropdownListModule } = await import('../dropdown-list/dropdown-list.module');
  //     return {
  //       component: DropdownListComponent,
  //       module: DropdownListModule
  //     }
  //   }, SpinnerAction.None)
  //     .then((dropdownList: DropdownListComponent<Item>) => {
  //       const elementRect = element.getBoundingClientRect();

  //       dropdownList.list = list;
  //       dropdownList.top = elementRect.top + elementRect.height + 2;
  //       dropdownList.left = elementRect.left;
  //       dropdownList.width = elementRect.width;

  //       dropdownList.onArrowSelect = (text: string) => {
  //         element.firstElementChild!.innerHTML = text;
  //       }
  //     });
  // }


  
}