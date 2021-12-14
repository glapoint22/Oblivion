import { KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ReviewFilter } from '../../classes/enums';
import { Review } from '../../classes/review';
import { ReportReviewFormComponent } from '../../components/report-review-form/report-review-form.component';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';

@Component({
  selector: 'reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements OnInit {
  public reviews: Array<Review> = new Array<Review>();
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



  public showButton!: boolean;
  public totalReviews: number = 12;
  private reviewsPerPage: number = 10;
  public currentPage!: number;
  public pageCount!: number;
  public reviewsStart!: number;
  public reviewsEnd!: number;

  constructor(private lazyLoadingService: LazyLoadingService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {


    this.showButton = this.router.url.indexOf('reviews') == -1 && this.totalReviews > 10;

    this.route.queryParamMap.subscribe((queryParams: ParamMap) => {
      let currentPage = queryParams.has('page') ? Math.max(1, Number.parseInt(queryParams.get('page') as string)) : 1;


      this.reviews = [
        {
          title: 'A work of art',
          rating: 5,
          userName: 'Mike',
          profileImage: {
            name: 'Mike',
            url: 'images/bron-pic.jpg'
          },
          date: 'October 11, 2018',
          isVerified: false,
          text: 'This product is a work of art',
          likes: 100,
          dislikes: 54
        },

        {
          title: 'Great Product',
          rating: 4,
          userName: 'Bob',
          profileImage: {
            name: 'Bob',
            url: 'images/bron-pic.jpg'
          },
          date: 'May 22, 2020',
          isVerified: true,
          text: 'This is a great product, I recommend it',
          likes: 70,
          dislikes: 20
        },

        {
          title: 'Love It!!!',
          rating: 5,
          userName: 'Jane',
          profileImage: {
            name: 'Jane',
            url: 'images/bron-pic.jpg'
          },
          date: 'September 18, 2016',
          isVerified: false,
          text: 'I love this product so much, I want to marry it',
          likes: 0,
          dislikes: 30
        },

        {
          title: 'Fucking Awesome!',
          rating: 5,
          userName: 'Scott',
          profileImage: {
            name: 'Scott',
            url: 'images/bron-pic.jpg'
          },
          date: 'July 26, 2015',
          isVerified: false,
          text: 'This is the best product that I have ever bought!',
          likes: 18,
          dislikes: 0
        },

        {
          title: 'I like it',
          rating: 3,
          userName: 'Todd',
          profileImage: {
            name: 'Todd',
            url: 'images/bron-pic.jpg'
          },
          date: 'October 19, 2021',
          isVerified: true,
          text: 'I like this product',
          likes: 78,
          dislikes: 42
        },

        {
          title: 'Pretty cool',
          rating: 2,
          userName: 'Sara',
          profileImage: {
            name: 'Sara',
            url: 'images/bron-pic.jpg'
          },
          date: 'February 27, 2019',
          isVerified: false,
          text: 'This product is pretty damn cool',
          likes: 29,
          dislikes: 51
        },

        {
          title: 'Pretty Good',
          rating: 3,
          userName: 'Dana',
          profileImage: {
            name: 'Dana',
            url: 'images/bron-pic.jpg'
          },
          date: 'January 03, 2021',
          isVerified: true,
          text: 'This product is pretty damn good',
          likes: 0,
          dislikes: 0
        },

        {
          title: 'Could be better',
          rating: 3,
          userName: 'Frank',
          profileImage: {
            name: 'Frank',
            url: 'images/bron-pic.jpg'
          },
          date: 'August 24, 2020',
          isVerified: false,
          text: 'This product could be better in my opinion',
          likes: 64,
          dislikes: 92
        },

        {
          title: 'Not Bad',
          rating: 2,
          userName: 'Megan',
          profileImage: {
            name: 'Megan',
            url: 'images/bron-pic.jpg'
          },
          date: 'June 09, 2019',
          isVerified: true,
          text: 'This product is alright. I’m not blown away by it, but I guess it’s ok',
          likes: 77,
          dislikes: 34
        },

        {
          title: 'So So',
          rating: 3,
          userName: 'Phil',
          profileImage: {
            name: 'Phil',
            url: 'images/bron-pic.jpg'
          },
          date: 'December 23, 2016',
          isVerified: false,
          text: 'This product is so so',
          likes: 21,
          dislikes: 85
        },

        // {
        //   title: 'Piece of shit',
        //   rating: 1,
        //   userName: 'Jim',
        //   profileImage: {
        //     name: 'Jim',
        //     url: 'images/bron-pic.jpg'
        //   },
        //   date: 'March 17, 2003',
        //   isVerified: true,
        //   text: 'I hate this product',
        //   likes: 14,
        //   dislikes: 39
        // },

        // {
        //   title: 'Make america great again',
        //   rating: 4,
        //   userName: 'Trumpy',
        //   profileImage: {
        //     name: 'Trumpy',
        //     url: 'images/bron-pic.jpg'
        //   },
        //   date: 'April 15, 2016',
        //   isVerified: true,
        //   text: 'This is MAGA country',
        //   likes: 45,
        //   dislikes: 45
        // },
      ]

      this.currentPage = currentPage;

      // Set the properties that display the starting and ending of reviews
      this.reviewsStart = this.reviewsPerPage * (this.currentPage - 1) + 1;
      this.reviewsEnd = this.reviewsStart + this.reviews.length - 1;
    });


  }





  async onReportReviewClick() {
    const { ReportReviewFormComponent } = await import('../../components/report-review-form/report-review-form.component');
    const { ReportReviewFormModule } = await import('../../components/report-review-form/report-review-form.module');

    this.lazyLoadingService.getComponentAsync(ReportReviewFormComponent, ReportReviewFormModule, this.lazyLoadingService.container)
      .then((reportReviewForm: ReportReviewFormComponent) => {

      });
  }



  onRateReviewClick(review: Review) {
    review.hasBeenRated = true;
  }



  onViewAllReviewsClick() {
    this.router.navigate(['reviews'], { relativeTo: this.route });
  }

  onReviewFilterChange(reviewFilter: KeyValue<string, string>) {
    this.router.navigate([], {
      queryParams: { filter: reviewFilter.value, page: null },
      queryParamsHandling: 'merge'
    });
  }
}