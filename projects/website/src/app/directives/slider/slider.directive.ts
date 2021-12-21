import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[slider]'
})
export class SliderDirective implements AfterViewInit {
  public sliderElement!: HTMLElement;
  public viewChecked!: boolean;
  @Input() scrollbarElement!: HTMLElement;
  @Input() leftArrowButtonElement!: HTMLElement;
  @Input() rightArrowButtonElement!: HTMLElement;
  public sliderPosition: number = 0;
  public sliderStartPosition!: number;
  private sliderStartClientX!: number;
  private startTime!: number;
  private sliderStopPosition: number = 0;
  public containerWidth!: number;
  private scrollbarPosition!: number;
  private transitionSpeed: number = 500;
  private scrollbarOffset!: number;

  constructor(el: ElementRef<HTMLElement>) {
    this.sliderElement = el.nativeElement;
    this.sliderElement.addEventListener('touchstart', this.onSliderTouchStart);
  }


  ngAfterViewChecked() {
    if (this.sliderElement.childElementCount > 0 && !this.viewChecked && this.sliderElement.childElementCount < 2) {
      this.viewChecked = true;
      if (this.scrollbarElement) {
        const scrollbarParentElement = this.scrollbarElement.parentElement as HTMLElement;
        scrollbarParentElement.style.display = 'none';
      }

      if (this.leftArrowButtonElement && this.rightArrowButtonElement) {
        this.leftArrowButtonElement.style.display = 'none';
        this.rightArrowButtonElement.style.display = 'none';
      }
    }
  }

  // ----------------------------------------------------------------- Ng After View Init ------------------------------------------------------------------------
  ngAfterViewInit(): void {
    this.containerWidth = this.sliderElement.parentElement?.clientWidth as number;
    this.sliderElement.style.left = '0';

    // Set the transitions to zero
    this.initializeTransitions();

    // If we have a scrollbar
    if (this.scrollbarElement) {
      this.scrollbarOffset = this.scrollbarElement.offsetLeft;
      this.scrollbarPosition = this.scrollbarOffset;
      this.scrollbarElement.style.left = this.scrollbarPosition + 'px';
      this.scrollbarElement.addEventListener('touchstart', this.onScrollbarStart);
      this.scrollbarElement.addEventListener('mousedown', this.onScrollbarStart);
    }

    // If we have arrows
    if (this.leftArrowButtonElement && this.rightArrowButtonElement) {
      this.leftArrowButtonElement.addEventListener('click', this.onLeftArrowClick);
      this.rightArrowButtonElement.addEventListener('click', this.onRightArrowClick);
      this.setLeftArrowVisibility();
    }
  }




  // ----------------------------------------------------------------- Initialize Transition ------------------------------------------------------------------------
  initializeTransitions() {
    this.sliderElement.style.transition = 'all 0ms ease 0s';
    if (this.scrollbarElement) this.scrollbarElement.style.transition = 'all 0ms ease 0s';
  }




  // ----------------------------------------------------------------- Set Transition ------------------------------------------------------------------------
  setTransitions(sliderPosition: number, scrollbarPosition: number) {
    const transition = 'all ' + this.transitionSpeed + 'ms cubic-bezier(0.22, 0.5, 0.5, 1) 0s';

    // Slider
    this.sliderElement.style.left = sliderPosition + 'px';
    this.sliderElement.style.transition = transition;

    // Scrollbar
    if (this.scrollbarElement) {
      this.scrollbarElement.style.left = scrollbarPosition + 'px';
      this.scrollbarElement.style.transition = transition;
    }
  }



  // ----------------------------------------------------------------- Set Right Arrow Visibility ------------------------------------------------------------------------
  setRightArrowVisibility() {
    if (!this.rightArrowButtonElement) return;

    if (this.sliderPosition == -(this.sliderElement.childElementCount - 1) * this.containerWidth) {
      this.rightArrowButtonElement.style.visibility = 'hidden';
    } else {
      this.rightArrowButtonElement.style.visibility = 'visible';
    }
  }





  // ----------------------------------------------------------------- Set Left Arrow Visibility ------------------------------------------------------------------------
  setLeftArrowVisibility() {
    if (!this.leftArrowButtonElement) return;

    if (this.sliderPosition == 0) {
      this.leftArrowButtonElement.style.visibility = 'hidden';
    } else {
      this.leftArrowButtonElement.style.visibility = 'visible';
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
      this.sliderMove(touchMoveEvent);
    }


    // Slider Touch End
    const onSliderTouchEnd = (touchEndEvent: TouchEvent) => {
      this.sliderEnd(touchEndEvent);

      // Remove the listeners
      this.sliderElement.removeEventListener('touchmove', onSliderToucheMove);
      this.sliderElement.removeEventListener('touchend', onSliderTouchEnd);
    }

    // Add the listeners
    this.sliderElement.addEventListener('touchmove', onSliderToucheMove);
    this.sliderElement.addEventListener('touchend', onSliderTouchEnd);
  };




  // ----------------------------------------------------------------- Slider Move ------------------------------------------------------------------------
  sliderMove(touchMoveEvent: TouchEvent) {
    // How much the slider has moved since the last move
    const delta = touchMoveEvent.changedTouches[0].clientX - this.sliderStartClientX;

    this.sliderStartClientX = touchMoveEvent.changedTouches[0].clientX;

    // Set the position
    this.sliderPosition += delta;
    this.sliderElement.style.left = this.sliderPosition + 'px';

    if (this.startTime == 0) this.startTime = touchMoveEvent.timeStamp;

    // This will set the position of the scrollbar when the slider is being moved
    if (this.scrollbarElement) {
      const normalizedPosition = this.sliderPosition / this.sliderElement.clientWidth;
      this.scrollbarPosition = (normalizedPosition * this.containerWidth) - this.scrollbarOffset;

      // Set the boundries
      this.scrollbarPosition = Math.min(-this.scrollbarOffset, this.scrollbarPosition);
      this.scrollbarPosition = Math.max(-(this.containerWidth +
        this.scrollbarOffset - this.scrollbarElement.getBoundingClientRect().width), this.scrollbarPosition);

      // Assign the position
      this.scrollbarElement.style.left = -this.scrollbarPosition + 'px';
    }
  }





  // ----------------------------------------------------------------- Slider End ------------------------------------------------------------------------
  sliderEnd(touchEndEvent: TouchEvent) {
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
    if (this.scrollbarElement) {
      const normalizedPosition = this.sliderPosition / this.sliderElement.clientWidth;
      this.scrollbarPosition = (normalizedPosition * this.containerWidth) - this.scrollbarOffset;
    }


    // Transition the slider and scrollbar
    this.setTransitions(this.sliderPosition, -this.scrollbarPosition);

    this.setRightArrowVisibility();
    this.setLeftArrowVisibility();
  }




  // ----------------------------------------------------------------- On Scrollbar Start ------------------------------------------------------------------------
  onScrollbarStart = (startEvent: TouchEvent | MouseEvent) => {
    // Initialize
    this.initializeTransitions();
    this.scrollbarPosition = this.getClientX(startEvent) - this.scrollbarElement.offsetLeft;


    // Scrollbar Move
    const onScrollbarMove = (moveEvent: TouchEvent | MouseEvent) => {

      // Set the position
      let pos = this.getClientX(moveEvent) - this.scrollbarPosition;
      pos = Math.max(this.scrollbarOffset, pos);
      this.scrollbarElement.style.left = Math.min(this.containerWidth +
        this.scrollbarOffset - this.scrollbarElement.getBoundingClientRect().width, pos) + 'px';



      // This will set the slider position based on the scrollbar
      const normalizedPosition = (this.scrollbarElement.offsetLeft - this.scrollbarOffset) / this.containerWidth;
      this.sliderPosition = -(normalizedPosition * this.sliderElement.clientWidth);
      this.sliderElement.style.left = this.sliderPosition + 'px';
    }


    // Scrollbar End
    const onScrollbarEnd = () => {
      // This will set the slider stopping position
      this.sliderPosition = Math.round(this.sliderPosition / this.containerWidth) * this.containerWidth;

      // Set the stopping scrollbar position
      const normalizedPosition = -this.sliderPosition / this.sliderElement.clientWidth;
      this.scrollbarPosition = (normalizedPosition * this.containerWidth) + this.scrollbarOffset;


      // Transition the slider and scrollbar
      this.setTransitions(this.sliderPosition, this.scrollbarPosition);

      this.setRightArrowVisibility();
      this.setLeftArrowVisibility();

      // Remove the listeners
      this.removeEventListeners(startEvent, this.scrollbarElement, onScrollbarMove, onScrollbarEnd);
    }



    // Add the listeners
    this.addEventListeners(startEvent, this.scrollbarElement, onScrollbarMove, onScrollbarEnd);
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

    this.setRightArrowVisibility();
    this.setLeftArrowVisibility();
  }





  // ----------------------------------------------------------------- Get Client X ------------------------------------------------------------------------
  getClientX(event: TouchEvent | MouseEvent) {
    if (event instanceof TouchEvent) {
      event = event as TouchEvent;
      return event.changedTouches[0].clientX;
    } else {
      event = event as MouseEvent;
      return event.clientX;
    }
  }






  // ----------------------------------------------------------------- Add Event Listeners ------------------------------------------------------------------------
  addEventListeners(event: TouchEvent | MouseEvent, element: HTMLElement, move: any, end: any) {
    if (event instanceof TouchEvent) {
      event = event as TouchEvent;
      element.addEventListener('touchmove', move);
      element.addEventListener('touchend', end);
    } else {
      event = event as MouseEvent;
      element.addEventListener('mousemove', move);
      element.addEventListener('mouseup', end);
    }
  }





  // ----------------------------------------------------------------- Remove Event Listeners ------------------------------------------------------------------------
  removeEventListeners(event: TouchEvent | MouseEvent, element: HTMLElement, move: any, end: any) {
    if (event instanceof TouchEvent) {
      event = event as TouchEvent;
      element.removeEventListener('touchmove', move);
      element.removeEventListener('touchend', end);
    } else {
      event = event as MouseEvent;
      element.removeEventListener('mousemove', move);
      element.removeEventListener('mouseup', end);
    }
  }





  // ----------------------------------------------------------------- Ng On Destroy ------------------------------------------------------------------------
  ngOnDestroy() {
    this.sliderElement.removeEventListener('touchstart', this.onSliderTouchStart);

    if (this.scrollbarElement) {
      this.scrollbarElement.removeEventListener('touchstart', this.onScrollbarStart);
      this.scrollbarElement.removeEventListener('mousedown', this.onScrollbarStart);
    }

    if (this.leftArrowButtonElement && this.rightArrowButtonElement) {
      this.leftArrowButtonElement.removeEventListener('click', this.onLeftArrowClick);
      this.rightArrowButtonElement.removeEventListener('click', this.onRightArrowClick);
    }
  }
}