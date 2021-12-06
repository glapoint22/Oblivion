import { Component, OnInit } from '@angular/core';
import { HelpfulReviews } from '../../classes/helpful-reviews';

@Component({
  selector: 'helpful-reviews',
  templateUrl: './helpful-reviews.component.html',
  styleUrls: ['./helpful-reviews.component.scss']
})
export class HelpfulReviewsComponent implements OnInit {
  public helpfulReviews: HelpfulReviews = new HelpfulReviews();

  constructor() { }

  ngOnInit(): void {
    this.helpfulReviews.positiveReview = {
      title: 'Fucking Awesome!',
      rating: 5,
      userName: 'Bronwyn',
      profileImage: {
        name: 'Bronwyn',
        url: 'images/bron-pic.jpg',
      },
      date: 'October 02, 2021',
      isVerified: true,
      text: 'This is the best product that I have ever bought!',
      likes: 52,
      dislikes: 5
    }



    this.helpfulReviews.negativeReview = {
      title: 'It\'s a Disgrace!',
      rating: 1,
      userName: 'Trumpy',
      profileImage: {
        name: 'Trumpy',
        url: 'assets/no-account-pic.png',
      },
      date: 'December 05, 2021',
      isVerified: false,
      text: 'This is the worst product that I have ever bought. I would advise you never buy this piece of shit of a product.',
      likes: 45,
      dislikes: 2
    }
  }

}
