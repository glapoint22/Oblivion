import { AfterViewInit, Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[slider]'
})
export class SliderDirective implements AfterViewInit {
  private sliderElement!: HTMLElement;
  private scrollbarElement!: HTMLElement;
  private leftArrowButtonElement!: HTMLElement;
  private rightArrowButtonElement!: HTMLElement;
  private sliderPosition: number = 0;
  private sliderStartPosition!: number;
  private sliderStartClientX!: number;
  private startTime!: number;
  private sliderStopPosition: number = 0;
  private containerWidth!: number;
  private scrollbarPosition!: number;
  private transitionSpeed: number = 500;
  private scrollbarOffset!: number;

  constructor(el: ElementRef<HTMLElement>) {
    this.sliderElement = el.nativeElement;
    this.sliderElement.addEventListener('touchstart', this.onSliderTouchStart);
  }


  // ----------------------------------------------------------------- Initialize Transition ------------------------------------------------------------------------
  initializeTransitions() {
    this.sliderElement.style.transition = 'all 0ms ease 0s';
    this.scrollbarElement.style.transition = 'all 0ms ease 0s';
  }




  // ----------------------------------------------------------------- Set Transition ------------------------------------------------------------------------
  setTransitions(sliderPosition: number, scrollbarPosition: number) {
    const transition = 'all ' + this.transitionSpeed + 'ms cubic-bezier(0.22, 0.5, 0.5, 1) 0s';

    // Slider
    this.sliderElement.style.left = sliderPosition + 'px';
    this.sliderElement.style.transition = transition;

    // Scrollbar
    this.scrollbarElement.style.left = scrollbarPosition + 'px';
    this.scrollbarElement.style.transition = transition;
  }


  // ----------------------------------------------------------------- Ng After View Init ------------------------------------------------------------------------
  ngAfterViewInit(): void {
    this.containerWidth = this.sliderElement.parentElement?.clientWidth as number;
    this.scrollbarElement = document.getElementById('scrollbar') as HTMLElement;
    this.leftArrowButtonElement = document.getElementById('left-arrow-button') as HTMLElement;
    this.rightArrowButtonElement = document.getElementById('right-arrow-button') as HTMLElement;
    this.sliderElement.style.left = '0';

    // Set the transitions to zero
    this.initializeTransitions();

    // If we have a scrollbar
    if (this.scrollbarElement) {
      this.scrollbarOffset = this.scrollbarElement.offsetLeft;
      this.scrollbarPosition = this.scrollbarOffset;
      this.scrollbarElement.style.left = this.scrollbarPosition + 'px';
      this.scrollbarElement.addEventListener('touchstart', this.onScrollbarTouchStart);
    }

    // If we have arrows
    if (this.leftArrowButtonElement && this.rightArrowButtonElement) {
      this.leftArrowButtonElement.addEventListener('click', this.onLeftArrowClick);
      this.rightArrowButtonElement.addEventListener('click', this.onRightArrowClick);
    }
  }








  // ----------------------------------------------------------------- On Slider Touch Start ------------------------------------------------------------------------
  onSliderTouchStart = (touchStartEvent: TouchEvent) => {
    // Initialize
    this.sliderStartClientX = touchStartEvent.changedTouches[0].clientX;
    this.sliderStartPosition = this.sliderPosition;
    this.startTime = 0;

    // Set the transitions to zero
    this.initializeTransitions();

    // Slider touch move
    const onSliderToucheMove = (touchMoveEvent: TouchEvent) => {
      // How much the slider has moved since the last move
      const delta = touchMoveEvent.changedTouches[0].clientX - this.sliderStartClientX;

      this.sliderStartClientX = touchMoveEvent.changedTouches[0].clientX;

      // Set the position
      this.sliderPosition += delta;
      this.sliderElement.style.left = this.sliderPosition + 'px';

      if (this.startTime == 0) this.startTime = touchMoveEvent.timeStamp;

      // This will set the position of the scrollbar when the slider is being moved
      const normalizedPosition = this.sliderPosition / this.sliderElement.clientWidth;
      this.scrollbarPosition = (normalizedPosition * this.containerWidth) - this.scrollbarOffset;

      // Set the boundries
      this.scrollbarPosition = Math.min(-this.scrollbarOffset, this.scrollbarPosition);
      this.scrollbarPosition = Math.max(-(this.containerWidth +
        this.scrollbarOffset - this.scrollbarElement.getBoundingClientRect().width), this.scrollbarPosition);

      // Assign the position
      this.scrollbarElement.style.left = -this.scrollbarPosition + 'px';
    }


    // Slider Touch End
    const onSliderTouchEnd = (touchEndEvent: TouchEvent) => {
      const damping = 0.4;
      const deltaPosition = this.sliderPosition - this.sliderStartPosition;
      const deltaTime = touchEndEvent.timeStamp - this.startTime;
      const velocity = deltaPosition / deltaTime * damping;
      const distance = velocity * this.containerWidth;
      const multiplier = Math.round(distance / this.containerWidth);

      // Calculate where the slider will stop
      this.sliderStopPosition = Math.round(this.sliderPosition / this.containerWidth) * this.containerWidth;

      // Set the slider position
      this.sliderPosition = multiplier * this.containerWidth + this.sliderStopPosition;

      // Set the boundries for the slider
      this.sliderPosition = Math.min(0, this.sliderPosition);
      this.sliderPosition = Math.max(-(this.sliderElement.childElementCount - 1) * this.containerWidth, this.sliderPosition);

      // Set the scrollbar position
      const normalizedPosition = this.sliderPosition / this.sliderElement.clientWidth;
      this.scrollbarPosition = (normalizedPosition * this.containerWidth) - this.scrollbarOffset;

      // Transition the slider and scrollbar
      this.setTransitions(this.sliderPosition, -this.scrollbarPosition);


      // Remove the listeners
      this.sliderElement.removeEventListener('touchmove', onSliderToucheMove);
      this.sliderElement.removeEventListener('touchend', onSliderTouchEnd);
    }

    // Add the listeners
    this.sliderElement.addEventListener('touchmove', onSliderToucheMove);
    this.sliderElement.addEventListener('touchend', onSliderTouchEnd);
  };









  // ----------------------------------------------------------------- On Scrollbar Touch Start ------------------------------------------------------------------------
  onScrollbarTouchStart = (touchStartEvent: TouchEvent) => {
    // Initialize
    this.initializeTransitions();
    this.scrollbarPosition = touchStartEvent.changedTouches[0].clientX - this.scrollbarElement.offsetLeft;


    // Scrollbar Touch Move
    const onScrollbarToucheMove = (touchMoveEvent: TouchEvent) => {

      // Set the position
      let pos = touchMoveEvent.changedTouches[0].clientX - this.scrollbarPosition;
      pos = Math.max(this.scrollbarOffset, pos);
      this.scrollbarElement.style.left = Math.min(this.containerWidth +
        this.scrollbarOffset - this.scrollbarElement.getBoundingClientRect().width, pos) + 'px';



      // This will set the slider position based on the scrollbar
      const normalizedPosition = (this.scrollbarElement.offsetLeft - this.scrollbarOffset) / this.containerWidth;
      this.sliderPosition = -(normalizedPosition * this.sliderElement.clientWidth);
      this.sliderElement.style.left = this.sliderPosition + 'px';
    }


    // Scrollbar Touch End
    const onScrollbarTouchEnd = () => {
      // This will set the slider stopping position
      this.sliderPosition = Math.round(this.sliderPosition / this.containerWidth) * this.containerWidth;

      // Set the stopping scrollbar position
      const normalizedPosition = -this.sliderPosition / this.sliderElement.clientWidth;
      this.scrollbarPosition = (normalizedPosition * this.containerWidth) + this.scrollbarOffset;


      // Transition the slider and scrollbar
      this.setTransitions(this.sliderPosition, this.scrollbarPosition);



      // Remove the listeners
      this.scrollbarElement.removeEventListener('touchmove', onScrollbarToucheMove);
      this.scrollbarElement.removeEventListener('touchend', onScrollbarTouchEnd);
    }



    // Add the listeners
    this.scrollbarElement.addEventListener('touchmove', onScrollbarToucheMove);
    this.scrollbarElement.addEventListener('touchend', onScrollbarTouchEnd);
  }



  // ----------------------------------------------------------------- On Left Arrow Click ------------------------------------------------------------------------
  onLeftArrowClick = () => {
    if (this.sliderPosition == 0) return;

    this.onArrowClick(1);
  }



  // ----------------------------------------------------------------- On Right Arrow Click ------------------------------------------------------------------------
  onRightArrowClick = () => {
    if (this.sliderPosition == -(this.sliderElement.childElementCount - 1) * this.containerWidth) return;

    this.onArrowClick(-1);
  }


  onArrowClick(direction: number) {
    // Set the slider position
    this.sliderPosition += this.containerWidth * direction;

    // Set the scrollbar position
    const normalizedPosition = this.sliderPosition / this.sliderElement.clientWidth;
    this.scrollbarPosition = (normalizedPosition * this.containerWidth) - this.scrollbarOffset;

    // Transition the slider and scrollbar
    this.setTransitions(this.sliderPosition, -this.scrollbarPosition);
  }



  // ----------------------------------------------------------------- Ng On Destroy ------------------------------------------------------------------------
  ngOnDestroy() {
    this.sliderElement.removeEventListener('touchstart', this.onSliderTouchStart);
    this.scrollbarElement.removeEventListener('touchstart', this.onScrollbarTouchStart);
    this.leftArrowButtonElement.removeEventListener('click', this.onLeftArrowClick);
    this.rightArrowButtonElement.removeEventListener('click', this.onRightArrowClick);
  }
}