import { KeyValue } from '@angular/common';
import { Injectable } from '@angular/core';
import { DataService } from 'common';
import { forkJoin } from 'rxjs';
import { QueryType, ComparisonOperatorType, AutoQueryType, LogicalOperatorType } from '../../classes/enums';
import { Item } from '../../classes/item';
import { QueryElement } from '../../classes/query-element';
import { QueryGroup } from '../../classes/query-group';
import { InputService } from '../input/input.service';

@Injectable({
  providedIn: 'root'
})
export class QueryBuilderService {
  public selectedQueryElements: Array<QueryElement> = [];
  public categoriesList!: Array<Item>;
  public nichesList!: Array<Item>;
  public keywordGroupsList!: Array<Item>;
  public subgroupsList!: Array<Item>;
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
      key: 'Product Group',
      value: QueryType.ProductGroup
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

  constructor(private inputService: InputService, private dataService: DataService) { }



  // ------------------------------------------------------------- On Query Element Click ----------------------------------------------------------
  public onQueryElementClick(queryElement: QueryElement): void {
    // Ctrl key is down
    if (this.inputService.ctrlKeydown) {

      // Is NOT selected
      if (!queryElement.selected) {
        if (queryElement instanceof QueryGroup) {

          // This will unselect all children of this group
          for (let i = 0; i < this.selectedQueryElements.length; i++) {
            const selectedQueryElement = this.selectedQueryElements[i];

            if (this.isParent(queryElement, selectedQueryElement)) {
              selectedQueryElement.selected = false;
              this.selectedQueryElements.splice(i, 1);
              i--;
            }
          }
        }

        // This will prevent selecting an element if any of its parents are already selected
        for (let i = 0; i < this.selectedQueryElements.length; i++) {
          const currentElement = this.selectedQueryElements[i];

          // If current element is a query group
          if (currentElement instanceof QueryGroup) {
            const queryGroup = currentElement as QueryGroup;

            if (this.isParent(queryGroup, queryElement)) return;
          }
        }



        queryElement.selected = true;
        this.selectedQueryElements.push(queryElement);

        // Is selected
      } else {
        const index = this.selectedQueryElements.findIndex(x => x == queryElement);

        queryElement.selected = false;
        this.selectedQueryElements.splice(index, 1);
      }

      // Ctrl key is not down
    } else {

      // Is NOT selected
      if (!queryElement.selected) {
        this.selectedQueryElements.forEach(x => x.selected = false);
        queryElement.selected = true;
        this.selectedQueryElements = [queryElement];

        // Is Selected
      } else {
        if (this.selectedQueryElements.length > 1) {
          this.selectedQueryElements.forEach(x => x.selected = false);
          queryElement.selected = true;
          this.selectedQueryElements = [queryElement];
        } else {
          queryElement.selected = false;
          this.selectedQueryElements = [];
        }
      }
    }
  }





  // ---------------------------------------------------------------- Get Query Lists --------------------------------------------------------------
  public getQueryLists(): void {
    if (this.categoriesList && this.categoriesList.length > 0) return;

    const categories$ = this.dataService.get('api/Categories');
    const niches$ = this.dataService.get('api/Niches');
    const KeywordGroups$ = this.dataService.get('api/Keywords');
    const subgroups$ = this.dataService.get('api/Subgroups');

    forkJoin([categories$, niches$, KeywordGroups$, subgroups$])
      .subscribe((results: Array<any>) => {
        this.categoriesList = results[0];
        this.nichesList = results[1];
        this.keywordGroupsList = results[2];
        this.subgroupsList = results[3];
      });
  }





  // ------------------------------------------------------------------- Is Parent -----------------------------------------------------------------
  private isParent(targetParent: QueryElement, element: QueryElement): boolean {
    let parent: any = element.parent;

    while (parent != null) {
      if (parent == targetParent) return true;
      parent = parent.parent;
    }

    return false;
  }
}