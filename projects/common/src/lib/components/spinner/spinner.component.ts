import { Component, OnInit } from '@angular/core';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';
import { SpinnerService } from '../../services/spinner/spinner.service';

@Component({
  selector: 'spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit {
  public showSpinner: boolean = false;
  public showComponent!: boolean;

  constructor(public spinnerService: SpinnerService, public lazyLoadingService: LazyLoadingService) { }

  ngOnInit(): void {
    this.lazyLoadingService.paddingRight = 0;
    this.spinnerService.spinnerState
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
}