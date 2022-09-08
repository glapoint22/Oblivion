import { KeyValue } from '@angular/common';
import { Injectable } from '@angular/core';
import { DataService } from 'common';
import { forkJoin } from 'rxjs';
import { QueryType, ComparisonOperatorType, AutoQueryType, LogicalOperatorType } from '../../classes/enums';
import { Item } from '../../classes/item';
import { SelectableQueryRow } from '../../classes/selectable-query-row';
import { InputService } from '../input/input.service';

@Injectable({
  providedIn: 'root'
})
export class QueryBuilderService {
  public selectedQueryRows: Array<SelectableQueryRow> = [];
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

  constructor(private inputService: InputService, private dataService: DataService) { }


  // ----------------------------------------------------------------- On Row Click ----------------------------------------------------------------
  public onQueryRowClick(queryRow: SelectableQueryRow): void {
    // Ctrl key is down
    if (this.inputService.ctrlKeydown) {

      // Is NOT selected
      if (!queryRow.selected) {
        queryRow.selected = true;
        this.selectedQueryRows.push(queryRow);

        // Is selected
      } else {
        const index = this.selectedQueryRows.findIndex(x => x == queryRow);

        queryRow.selected = false;
        this.selectedQueryRows.splice(index, 1);
      }

      // Ctrl key is not down
    } else {

      // Is NOT selected
      if (!queryRow.selected) {
        this.selectedQueryRows.forEach(x => x.selected = false);
        queryRow.selected = true;
        this.selectedQueryRows = [queryRow];

        // Is Selected
      } else {
        if (this.selectedQueryRows.length > 1) {
          this.selectedQueryRows.forEach(x => x.selected = false);
          queryRow.selected = true;
          this.selectedQueryRows = [queryRow];
        } else {
          queryRow.selected = false;
          this.selectedQueryRows = [];
        }
      }
    }
  }





  // ---------------------------------------------------------------- Get Query Lists --------------------------------------------------------------
  public getQueryLists(): void {
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
}