import { Component, OnInit } from '@angular/core';
import { Modal } from '../../classes/modal';

@Component({
  selector: 'report-review-form',
  templateUrl: './report-review-form.component.html',
  styleUrls: ['./report-review-form.component.scss']
})
export class ReportReviewFormComponent extends Modal {

  onSubmit() {
    console.log("Submit!")
  }
}