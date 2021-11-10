import { Component, OnInit } from '@angular/core';
import { LazyLoad } from '../../classes/lazy-load';

@Component({
  selector: 'report-review-form',
  templateUrl: './report-review-form.component.html',
  styleUrls: ['./report-review-form.component.scss']
})
export class ReportReviewFormComponent extends LazyLoad {

  onSubmit() {
    console.log("Submit!")
  }
}