import { Component, OnInit } from '@angular/core';
import { SpinnerService } from '../../services/spinner/spinner.service';

@Component({
  selector: 'spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit {
  private windowScrollY!: number;
  public showSpinner: boolean = false;
  public showComponent!: boolean;

  constructor(private spinnerService: SpinnerService) { }

  ngOnInit(): void {
    this.spinnerService.spinnerState
      .subscribe((show: boolean) => {
        if (show) {
          this.showComponent = true;
          this.showSpinner = false;
          window.setTimeout(() => {
            if (this.spinnerService.show)
              this.showSpinner = true;
          });

          this.windowScrollY = window.scrollY;
          window.addEventListener('scroll', this.onWindowScroll);

        } else {
          this.showSpinner = false;
          window.setTimeout(() => {
            this.showComponent = false;
            window.removeEventListener('scroll', this.onWindowScroll);
          }, 500);
        }
      });


  }

  onWindowScroll = () => {
    window.scrollTo(0, this.windowScrollY);
  }
}