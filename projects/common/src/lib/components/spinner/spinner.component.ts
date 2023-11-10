import { Component, OnInit } from '@angular/core';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit {
  public showSpinner: boolean = false;
  public showComponent!: boolean;
  public window = window;
  private spinnerStateSubscription!: Subscription;

  constructor(public spinnerService: SpinnerService) { }

  ngOnInit(): void {
    this.spinnerStateSubscription = this.spinnerService.spinnerState
      .subscribe((show: boolean) => {
        if (show) {
          this.showComponent = true;
          this.showSpinner = false;
          window.setTimeout(() => {
            if (this.spinnerService.show)
              this.showSpinner = true;
          });

        } else {
          this.showSpinner = false;
          window.setTimeout(() => {
            this.showComponent = false;
          }, 500);
        }
      });
  }



  ngOnDestroy() {
    if (this.spinnerStateSubscription) this.spinnerStateSubscription.unsubscribe();
  }
}