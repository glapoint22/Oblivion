import { Directive } from '@angular/core';
import { SliderDirective } from 'common';

@Directive({
  selector: '[carousel]'
})
export class CarouselDirective extends SliderDirective {
  private interval!: number;
  private carouselSet!: boolean;

  ngOnChanges(): void {
      super.ngOnChanges();
      this.carouselSet = false;
      window.clearInterval(this.interval);
  }

  ngAfterViewInit(): void {
      super.ngAfterViewInit();

      this.sliderElement.appendChild(this.sliderElement.children[0].cloneNode(true) as HTMLElement);
      this.sliderElement.insertBefore(this.sliderElement.children[this.sliderElement.childElementCount - 2].cloneNode(true) as HTMLElement, this.sliderElement.firstElementChild);

      this.leftArrowButtonElement.addEventListener('mousedown', this.onLeftArrowButtonMouseDown);
      this.rightArrowButtonElement.addEventListener('mousedown', this.onRightArrowButtonMouseDown);
  }


  // ----------------------------------------------------------------- Ng After View Checked ------------------------------------------------------------------------
  ngAfterViewChecked() {
    super.ngAfterViewChecked();

    if (this.sliderElement.childElementCount > 0 && !this.carouselSet) {
      this.carouselSet = true;

      this.sliderPosition = -this.containerWidth;
      this.sliderElement.style.left = this.sliderPosition + 'px';

      this.startTimer();
    }
  }




  // ----------------------------------------------------------------- Start Timer ------------------------------------------------------------------------
  startTimer() {
    this.interval = window.setInterval(() => {
      if (this.sliderPosition == -((this.sliderElement.childElementCount - 2) * this.containerWidth)) {
        this.initializeTransitions();
        this.sliderElement.style.left = 0 + 'px';
        this.sliderPosition = -this.containerWidth;
        window.setTimeout(() => {
          this.setTransitions(this.sliderPosition, 0);
        });
      } else {
        this.sliderPosition -= this.containerWidth;
        this.setTransitions(this.sliderPosition, 0);
      }
    }, 5000)
  }






  // ----------------------------------------------------------------- On Left Arrow Button Mouse Down ------------------------------------------------------------------------
  onLeftArrowButtonMouseDown = () => {
    // Reset the timer
    window.clearInterval(this.interval);
    this.startTimer();

    if (this.sliderPosition == -this.containerWidth) {
      this.initializeTransitions();
      this.sliderPosition = -((this.sliderElement.childElementCount - 1) * this.containerWidth);
      this.sliderElement.style.left = this.sliderPosition + 'px';
    }
  }





  // ----------------------------------------------------------------- On Right Arrow Button Mouse Down ------------------------------------------------------------------------
  onRightArrowButtonMouseDown = () => {
    // Reset the timer
    window.clearInterval(this.interval);
    this.startTimer();

    if (this.sliderPosition == -((this.sliderElement.childElementCount - 2) * this.containerWidth)) {
      this.initializeTransitions();
      this.sliderPosition = 0;
      this.sliderElement.style.left = this.sliderPosition + 'px';
    }
  }







  // ----------------------------------------------------------------- Slider Move ------------------------------------------------------------------------
  sliderMove(touchMoveEvent: TouchEvent): void {
    // Stop the timer
    window.clearInterval(this.interval);

    // Position the slider at the end
    if (this.sliderPosition > -this.containerWidth) {
      this.sliderStartPosition = (this.sliderElement.childElementCount - 1) * -this.containerWidth;
      this.sliderPosition = this.sliderStartPosition + (this.sliderPosition + this.containerWidth);
    }


    // Position the slider at the begining
    if (this.sliderPosition < (this.sliderElement.childElementCount - 1) * -this.containerWidth) {
      this.sliderStartPosition = -this.containerWidth;
      this.sliderPosition = -this.containerWidth;
    }

    super.sliderMove(touchMoveEvent);
  }







  // ----------------------------------------------------------------- Slider End ------------------------------------------------------------------------
  sliderEnd(touchEndEvent: TouchEvent): void {
    // Start the timer
    this.startTimer();

    super.sliderEnd(touchEndEvent);

    // Position the slider at the begining
    if (this.sliderPosition == (this.sliderElement.childElementCount - 1) * -this.containerWidth) {
      this.sliderPosition = -this.containerWidth;
    }



    // Position the slider at the end
    if (this.sliderPosition == 0) {
      this.sliderPosition = (this.sliderElement.childElementCount - 2) * -this.containerWidth;
    }
  }






  // ----------------------------------------------------------------- Ng On Destroy ------------------------------------------------------------------------
  ngOnDestroy() {
    super.ngOnDestroy();
    this.leftArrowButtonElement.removeEventListener('mousedown', this.onLeftArrowButtonMouseDown);
    this.rightArrowButtonElement.removeEventListener('mousedown', this.onRightArrowButtonMouseDown);
  }



  // This will keep the arrows from hiding
  setLeftArrowVisibility(): void { }
  setRightArrowVisibility(): void { }
}
