import { KeyValue } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AccountService, DataService, DropdownType, LazyLoadingService, ReviewFilter, SpinnerAction, SummaryProduct } from 'common';
import { Subscription } from 'rxjs';
import { Review } from '../../classes/review';
import { ReportReviewFormComponent } from '../../components/report-review-form/report-review-form.component';
import { ReviewsSideMenuComponent } from '../../components/reviews-side-menu/reviews-side-menu.component';

@Component({
  selector: 'reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements OnInit {
  @Input() product!: SummaryProduct;
  @Input() showPaginator: boolean = false;
  public reviews: Array<Review> = new Array<Review>();
  public selectedFilter!: KeyValue<string, string>;
  public selectedSort!: KeyValue<string, string>;
  public showButton!: boolean;
  public totalReviews!: number;
  private reviewsPerPage: number = 10;
  public currentPage!: number;
  public pageCount!: number;
  public showing!: string;
  public DropdownType = DropdownType;
  private routeQueryParamMapSubscription!: Subscription;
  private dataServiceGetSubscription!: Subscription;
  private dataServicePutSubscription!: Subscription;
  public reviewFilterDropdownList: Array<KeyValue<string, string>> =
    [
      {
        key: 'Filter by All Stars',
        value: ReviewFilter.AllStars
      },
      {
        key: 'Filter by 5 Stars',
        value: ReviewFilter.FiveStars
      },
      {
        key: 'Filter by 4 Stars',
        value: ReviewFilter.FourStars
      },
      {
        key: 'Filter by 3 Stars',
        value: ReviewFilter.ThreeStars
      },
      {
        key: 'Filter by 2 Stars',
        value: ReviewFilter.TwoStars
      },
      {
        key: 'Filter by 1 Star',
        value: ReviewFilter.OneStar
      }
    ];


  public reviewSortDropdownList: Array<KeyValue<string, string>> =
    [
      {
        key: 'Sort by High to Low Rating',
        value: 'high-to-low'
      },
      {
        key: 'Sort by Low to High Rating',
        value: 'low-to-high'
      },
      {
        key: 'Sort by Newest to Oldest',
        value: 'newest-to-oldest'
      },
      {
        key: 'Sort by Oldest to Newest',
        value: 'oldest-to-newest'
      },
      {
        key: 'Sort by Most Helpful',
        value: 'most-helpful'
      }
    ];


  constructor(
    private lazyLoadingService: LazyLoadingService,
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService,
    private accountService: AccountService
  ) { }

  ngOnInit(): void {
    this.routeQueryParamMapSubscription = this.route.queryParamMap.subscribe((queryParams: ParamMap) => {
      const currentPage = queryParams.has('page') ? Math.max(1, Number.parseInt(queryParams.get('page') as string)) : 1;
      const sort = queryParams.get('sort');
      const filter = queryParams.get('filter');


      this.selectedFilter = this.getSelectedDropdown(this.reviewFilterDropdownList, 'filter');
      this.selectedSort = this.getSelectedDropdown(this.reviewSortDropdownList, 'sort');
      this.currentPage = currentPage;



      this.dataServiceGetSubscription = this.dataService.get('api/ProductReviews/GetReviews', [
        { key: 'productId', value: this.product.id },
        { key: 'sortBy', value: sort ? sort : '' },
        { key: 'filterBy', value: filter ? filter : '' },
        { key: 'page', value: currentPage }
      ]).subscribe((reviews: any) => {
        this.reviews = reviews.reviews;
        this.pageCount = reviews.pageCount;
        this.totalReviews = reviews.totalReviews;
        this.showButton = !this.router.url.includes('/reviews') && this.product.totalReviews > 10;

        // Set the properties that display the starting and ending of reviews
        if (this.totalReviews > 0) {
          const reviewsStart = this.reviewsPerPage * (this.currentPage - 1) + 1;
          const reviewsEnd = reviewsStart + this.reviews.length - 1;

          this.showing = 'Showing ' + reviewsStart + ' - ' + reviewsEnd + ' of ' + this.totalReviews + ' review' + (this.totalReviews > 1 ? 's' : '');
        } else {
          this.showing = 'Showing 0 results';
        }

        // Scroll to top of reviews
        if (this.route.snapshot.fragment == 'reviews-top') {
          const reviewsContainerElement = document.getElementsByClassName('reviews-container')[0] as HTMLElement;
          const headerContainerElement = document.getElementsByClassName('header-container')[0] as HTMLElement;
          const pos = reviewsContainerElement.offsetTop - headerContainerElement.getBoundingClientRect().height;
          window.scrollTo(0, pos);
        }
      });
    });
  }



  async onReportReviewClick(reviewId: number) {
    if (this.accountService.user) {
      this.lazyLoadingService.load(async () => {
        const { ReportReviewFormComponent } = await import('../../components/report-review-form/report-review-form.component');
        const { ReportReviewFormModule } = await import('../../components/report-review-form/report-review-form.module');

        return {
          component: ReportReviewFormComponent,
          module: ReportReviewFormModule
        }
      }, SpinnerAction.StartEnd)
        .then((reportReviewForm: ReportReviewFormComponent) => {
          reportReviewForm.productId = this.product.id;
          reportReviewForm.reviewId = reviewId;
        });

    } else {
      this.logIn(reviewId);
    }
  }







  onRateReviewClick(review: Review, likes: number, dislikes: number) {
    this.dataServicePutSubscription = this.dataService
      .put('api/ProductReviews/RateReview', {
        reviewId: review.id,
        likes: likes,
        dislikes: dislikes
      })
      .subscribe(() => {
        review.hasBeenRated = true;
      });
  }



  onViewAllReviewsClick() {
    this.router.navigate(['reviews'], { relativeTo: this.route });
  }




  onReviewFilterChange(reviewFilter: KeyValue<string, string>) {
    if (reviewFilter != this.selectedFilter) {
      this.selectedFilter = reviewFilter;
      this.router.navigate([], {
        queryParams: { filter: reviewFilter.value, page: null },
        queryParamsHandling: 'merge',
        fragment: 'reviews-top'
      });
    }
  }




  onSortChange(sortFilter: KeyValue<string, string>) {
    if(sortFilter != this.selectedSort) {
      this.selectedSort = sortFilter;
      this.router.navigate([], {
        queryParams: { sort: sortFilter.value, page: null },
        queryParamsHandling: 'merge',
        fragment: 'reviews-top'
      });
    }
  }


  getSelectedDropdown(dropdownList: Array<KeyValue<string, string>>, value: string): KeyValue<string, string> {
    const index = Math.max(0, dropdownList.findIndex(x => x.value == this.route.snapshot.queryParams[value]));
    return dropdownList[index];
  }


  async onHamburgerButtonClick() {
    this.lazyLoadingService.load(async () => {
      const { ReviewsSideMenuComponent } = await import('../../components/reviews-side-menu/reviews-side-menu.component');
      const { ReviewsSideMenuModule } = await import('../../components/reviews-side-menu/reviews-side-menu.module');

      return {
        component: ReviewsSideMenuComponent,
        module: ReviewsSideMenuModule
      }
    }, SpinnerAction.StartEnd)
      .then((reviewsSideMenu: ReviewsSideMenuComponent) => {
        reviewsSideMenu.filtersList = this.reviewFilterDropdownList;
        reviewsSideMenu.selectedFilter = this.selectedFilter;

        const reviewsSideMenuOnFilterChangeSubscription = reviewsSideMenu.onFilterChange.subscribe((filter: KeyValue<string, string>) => {
          reviewsSideMenuOnFilterChangeSubscription.unsubscribe();
          this.onReviewFilterChange(filter);
        });

        reviewsSideMenu.sortList = this.reviewSortDropdownList;
        reviewsSideMenu.selectedSort = this.selectedSort;

        const reviewsSideMenuOnSortChangeSubscription = reviewsSideMenu.onSortChange.subscribe((sort: KeyValue<string, string>) => {
          reviewsSideMenuOnSortChangeSubscription.unsubscribe();
          this.onSortChange(sort);
        });
      });
  }


  async logIn(reviewId: number) {
    this.lazyLoadingService.load(async () => {
      const { LogInFormComponent } = await import('../log-in-form/log-in-form.component');
      const { LogInFormModule } = await import('../log-in-form/log-in-form.module');

      return {
        component: LogInFormComponent,
        module: LogInFormModule
      }
    }, SpinnerAction.StartEnd)
      .then(() => {
        const accountServiceOnRedirectSubscription: Subscription = this.accountService.onRedirect.subscribe(() => {
          this.onReportReviewClick(reviewId);
          accountServiceOnRedirectSubscription.unsubscribe();
        });

      });
  }


  getDate(date: string) {
    return new Date(date + 'Z');
  }



  ngOnDestroy() {
    if (this.dataServiceGetSubscription) this.dataServiceGetSubscription.unsubscribe();
    if (this.dataServicePutSubscription) this.dataServicePutSubscription.unsubscribe();
    if (this.routeQueryParamMapSubscription) this.routeQueryParamMapSubscription.unsubscribe();
  }
}