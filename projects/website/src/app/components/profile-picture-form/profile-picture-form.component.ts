import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { CircleOverlay } from '../../classes/circle-overlay';
import { LazyLoad } from '../../classes/lazy-load';
import { AccountService } from '../../services/account/account.service';
import { DataService } from '../../services/data/data.service';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { SuccessPromptComponent } from '../success-prompt/success-prompt.component';

@Component({
  selector: 'profile-picture-form',
  templateUrl: './profile-picture-form.component.html',
  styleUrls: ['./profile-picture-form.component.scss']
})
export class ProfilePictureFormComponent extends LazyLoad {
  private scaleValue: number = 1;
  private initialPicWidth!: number;
  private initialPicHeight!: number;
  private picScalingStart = { left: 0, top: 0, width: 0, height: 0 };
  private circle: CircleOverlay = new CircleOverlay();

  public imageFile!: Blob;
  public picLoaded!: boolean;
  public dragMessageVisible: boolean = true;
  public picMoveStartX!: number | null;
  public picMoveStartY!: number | null;
  public minusButtonDisabled: boolean = true;
  public zoomHandleMoveStartPos!: number | null;
  public plusButtonDisabled!: boolean;

  @ViewChild('zoomBar', { static: false }) zoomBar!: ElementRef<HTMLElement>;
  @ViewChild('picContainer', { static: false }) picContainer!: ElementRef<HTMLElement>;
  @ViewChild('pic', { static: false }) pic!: ElementRef<HTMLImageElement>;
  @ViewChild('circleOverlay', { static: false }) circleOverlay!: ElementRef<HTMLElement>;
  @ViewChild('zoomHandle', { static: false }) zoomHandle!: ElementRef<HTMLElement>;

  constructor
    (
      private dataService: DataService,
      private accountService: AccountService,
      private lazyLoadingService: LazyLoadingService,
      private spinnerService: SpinnerService
    ) {
    super();
  }

  onOpen() {
    this.getImage(this.imageFile);
  }


  onPicLoad() {
    this.picLoaded = true;
    this.setPic();
  }



  @HostListener('window:resize')
  onWindowResize() {
    if (this.pic) {
      this.setPic();
    }
  }


  setPic() {
    this.minusButtonDisabled = true;
    this.zoomHandle.nativeElement.style.left = "0";
    this.SetZoomHandleBoundarys();
    this.circle.diameter = this.circle.getDiameter(this.picContainer.nativeElement, this.circleOverlay.nativeElement);


    // If the pic's origianl width is larger than its original height
    if (this.pic.nativeElement.naturalWidth > this.pic.nativeElement.naturalHeight) {
      // Get the ratio of width to height
      let ratio = this.pic.nativeElement.naturalWidth / this.pic.nativeElement.naturalHeight;

      // Redefine the dimensions of the pic
      this.pic.nativeElement.style.height = this.circle.diameter + "px";
      this.pic.nativeElement.style.width = (this.circle.diameter * ratio) + "px";
      this.pic.nativeElement.style.top = ((this.picContainer.nativeElement.offsetHeight / 2) - (this.circle.diameter / 2)) + "px";
      this.pic.nativeElement.style.left = ((this.picContainer.nativeElement.offsetWidth / 2) - (this.pic.nativeElement.offsetWidth / 2)) + "px";

      // But if the pic's origianl height is larger than its original width
    } else {

      // Get the ratio of height to width
      let ratio = this.pic.nativeElement.naturalHeight / this.pic.nativeElement.naturalWidth;

      // Redefine the dimensions of the pic
      this.pic.nativeElement.style.width = this.circle.diameter + "px";
      this.pic.nativeElement.style.height = (this.circle.diameter * ratio) + "px";
      this.pic.nativeElement.style.left = ((this.picContainer.nativeElement.offsetWidth / 2) - (this.circle.diameter / 2)) + "px";
      this.pic.nativeElement.style.top = ((this.picContainer.nativeElement.offsetHeight / 2) - (this.pic.nativeElement.offsetHeight / 2)) + "px";
    }

    // Get the initial width and height of the pic (used for scaling)
    this.initialPicWidth = this.pic.nativeElement.offsetWidth;
    this.initialPicHeight = this.pic.nativeElement.offsetHeight;


    // Set the pic scaling starting values
    this.picScalingStart.left = this.pic.nativeElement.offsetLeft;
    this.picScalingStart.top = this.pic.nativeElement.offsetTop;
    this.picScalingStart.width = this.pic.nativeElement.offsetWidth;
    this.picScalingStart.height = this.pic.nativeElement.offsetHeight;

    this.circle.set(this.picContainer.nativeElement, this.pic.nativeElement);
  }





  onPicDown(e: MouseEvent) {
    this.dragMessageVisible = false;
    this.picMoveStartX = e.clientX - (e.target as HTMLElement).getBoundingClientRect().left;
    this.picMoveStartY = e.clientY - (e.target as HTMLElement).getBoundingClientRect().top;
  }


  onPicTouch(e: TouchEvent) {
    this.dragMessageVisible = false;
    this.picMoveStartX = e.touches[0].clientX - (e.target as HTMLElement).getBoundingClientRect().left;
    this.picMoveStartY = e.touches[0].clientY - (e.target as HTMLElement).getBoundingClientRect().top;
  }


  onZoomHandleDown(e: MouseEvent) {
    this.zoomHandleMoveStartPos = e.clientX - this.zoomHandle.nativeElement.offsetLeft;
  }


  onZoomHandleTouch(e: TouchEvent) {
    this.zoomHandleMoveStartPos = e.touches[0].clientX - this.zoomHandle.nativeElement.offsetLeft;
  }


  onMinusButtonClick() {
    if (!this.minusButtonDisabled) {
      let zoomHandleSteppingDistance = this.zoomBar.nativeElement.offsetWidth * 0.075;
      this.zoomHandle.nativeElement.style.left = (this.zoomHandle.nativeElement.offsetLeft - zoomHandleSteppingDistance) + "px";
      this.SetZoomHandleBoundarys();
    }
  }


  onPlusButtonClick() {
    if (!this.plusButtonDisabled) {
      let zoomHandleSteppingDistance = this.zoomBar.nativeElement.offsetWidth * 0.075;
      this.zoomHandle.nativeElement.style.left = (this.zoomHandle.nativeElement.offsetLeft + zoomHandleSteppingDistance) + "px";
      this.SetZoomHandleBoundarys();
    }
  }


  onZoomBarDown(e: MouseEvent) {
    this.zoomHandle.nativeElement.style.left = (e.clientX - this.zoomBar.nativeElement.getBoundingClientRect().left - (this.zoomHandle.nativeElement.offsetWidth / 2)) + "px";
    this.zoomHandleMoveStartPos = e.clientX - this.zoomHandle.nativeElement.offsetLeft;
    this.SetZoomHandleBoundarys();
  }


  onZoomBarStart(e: TouchEvent) {
    this.zoomHandle.nativeElement.style.left = (e.touches[0].clientX - this.zoomBar.nativeElement.getBoundingClientRect().left - (this.zoomHandle.nativeElement.offsetWidth / 2)) + "px";
    this.zoomHandleMoveStartPos = e.touches[0].clientX - this.zoomHandle.nativeElement.offsetLeft;
    this.SetZoomHandleBoundarys();
  }


  @HostListener('mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    this.onMove(e);
  }


  @HostListener('touchmove', ['$event'])
  onTouchMove(e: TouchEvent) {
    this.onMove(e);
  }

  onMove(e: MouseEvent | TouchEvent) {
    const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
    const clientY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;

    if (this.picMoveStartX && this.picMoveStartY) {
      // Move the pic
      this.pic.nativeElement.style.left = ((clientX - this.picContainer.nativeElement.getBoundingClientRect().left) - this.picMoveStartX) + "px";
      this.pic.nativeElement.style.top = ((clientY - this.picContainer.nativeElement.getBoundingClientRect().top) - this.picMoveStartY) + "px";
      // Set the boundarys
      this.setPicBoundarys();

      this.picScalingStart.left = this.pic.nativeElement.offsetLeft;
      this.picScalingStart.top = this.pic.nativeElement.offsetTop;
      this.picScalingStart.width = this.pic.nativeElement.offsetWidth;
      this.picScalingStart.height = this.pic.nativeElement.offsetHeight;

      this.circle.set(this.picContainer.nativeElement, this.pic.nativeElement);
    }

    // Move the zoom handle
    if (this.zoomHandleMoveStartPos) {
      this.zoomHandle.nativeElement.style.left = ((clientX) - this.zoomHandleMoveStartPos) + "px";
      // Set the boundarys
      this.SetZoomHandleBoundarys();
    }
  }


  setPicBoundarys() {
    // Left boundary
    if (this.pic.nativeElement.offsetLeft > this.circle.left) {
      this.pic.nativeElement.style.left = this.circle.left + "px";
    }

    // Right boundary
    if ((this.pic.nativeElement.offsetLeft) + this.pic.nativeElement.offsetWidth < this.circle.right) {
      this.pic.nativeElement.style.left = (-this.pic.nativeElement.offsetWidth + this.circle.right) + "px";
    }

    // Top boundary
    if (this.pic.nativeElement.offsetTop > this.circle.top) {
      this.pic.nativeElement.style.top = this.circle.top + "px";
    }

    // Bottom boundary
    if ((this.pic.nativeElement.offsetTop) + this.pic.nativeElement.offsetHeight < this.circle.bottom) {
      this.pic.nativeElement.style.top = (-this.pic.nativeElement.offsetHeight + this.circle.bottom) + "px";
    }
  }



  SetZoomHandleBoundarys() {
    // Left boundary
    if (this.zoomHandle.nativeElement.offsetLeft <= this.zoomBar.nativeElement.offsetLeft) {
      this.minusButtonDisabled = true;
      this.zoomHandle.nativeElement.style.left = this.zoomBar.nativeElement.offsetLeft + "px";
    }
    if (this.zoomHandle.nativeElement.offsetLeft > this.zoomBar.nativeElement.offsetLeft) {
      this.minusButtonDisabled = false;
    }

    // Reset the pic scaling starting values
    if (this.zoomHandle.nativeElement.offsetLeft == this.zoomBar.nativeElement.offsetLeft) {
      this.picScalingStart.left = this.pic.nativeElement.offsetLeft;
      this.picScalingStart.top = this.pic.nativeElement.offsetTop;
      this.picScalingStart.width = this.pic.nativeElement.offsetWidth;
      this.picScalingStart.height = this.pic.nativeElement.offsetHeight;

      this.circle.set(this.picContainer.nativeElement, this.pic.nativeElement);
    }

    // Right boundary
    if (this.zoomHandle.nativeElement.offsetLeft + this.zoomHandle.nativeElement.offsetWidth >= this.zoomBar.nativeElement.offsetLeft + this.zoomBar.nativeElement.offsetWidth) {
      this.plusButtonDisabled = true;
      this.zoomHandle.nativeElement.style.left = (this.zoomBar.nativeElement.offsetLeft + this.zoomBar.nativeElement.offsetWidth - this.zoomHandle.nativeElement.offsetWidth) + "px";
    }
    if (this.zoomHandle.nativeElement.offsetLeft + this.zoomHandle.nativeElement.offsetWidth < this.zoomBar.nativeElement.offsetLeft + this.zoomBar.nativeElement.offsetWidth) {
      this.plusButtonDisabled = false;
    }
    this.scalePic();
  }


  @HostListener('mouseup')
  onMouseUp() {
    this.picMoveStartX = null;
    this.picMoveStartY = null;
    this.zoomHandleMoveStartPos = null;
  }


  @HostListener('touchend')
  onTouchEnd() {
    this.picMoveStartX = null;
    this.picMoveStartY = null;
    this.zoomHandleMoveStartPos = null;
  }


  onMouseWheel(event: WheelEvent) {
    let wheelDelta = Math.max(-1, Math.min(1, (event.deltaY || -event.detail)));
    let zoomHandleSteppingDistance = this.zoomBar.nativeElement.offsetWidth * 0.075;
    this.zoomHandle.nativeElement.style.left = (this.zoomHandle.nativeElement.offsetLeft + (zoomHandleSteppingDistance * -wheelDelta)) + "px";
    this.SetZoomHandleBoundarys();
  }







  getScaleLeft() {
    const scaleSpeed = this.circle.percentCenter;
    const scaleDistance = this.pic.nativeElement.offsetWidth - this.picScalingStart.width;
    const scaleWidth = scaleDistance * scaleSpeed;
    const scaleLeft = this.picScalingStart.left - scaleWidth;
    return scaleLeft + "px";
  }


  getScaleTop() {
    const scaleSpeed = this.circle.percentMiddle;
    const scaleDistance = this.pic.nativeElement.offsetHeight - this.picScalingStart.height;
    const scaleHeight = scaleDistance * scaleSpeed;
    const scaleTop = this.picScalingStart.top - scaleHeight;
    return scaleTop + "px";
  }


  scalePic() {
    let zoomHandleLeft = this.zoomHandle.nativeElement.offsetLeft;
    let zoomBarWidth = 2.3 / (this.zoomBar.nativeElement.offsetWidth);
    this.scaleValue = 1 + (zoomHandleLeft * zoomBarWidth);

    this.pic.nativeElement.style.width = (this.initialPicWidth * this.scaleValue) + "px";
    this.pic.nativeElement.style.height = (this.initialPicHeight * this.scaleValue) + "px";
    this.pic.nativeElement.style.left = this.getScaleLeft();
    this.pic.nativeElement.style.top = this.getScaleTop();

    this.setPicBoundarys();
  }



  onNewImageButtonClick(fileInput: HTMLInputElement) {
    // Clear the picture select input (This is so the same filename can be re-entered again and again)
    fileInput.value = '';
    // Open the file explorer window
    fileInput.click();
  }


  onNewImageSelect(image: Blob) {
    this.imageFile = image;
    this.getImage(this.imageFile);
  }


  getImage(image: Blob) {
    const reader = new FileReader();
    this.picLoaded = false;
    this.spinnerService.show = true;

    reader.onload = () => {
      this.pic.nativeElement.src = reader.result!.toString();
      this.spinnerService.show = false;
    };

    reader.readAsDataURL(image);
  }


  onSubmit() {
    this.spinnerService.show = true;
    const formData = new FormData()
    formData.append('newImage', this.imageFile);
    formData.append('currentImage', !this.accountService.customer?.hasProfileImage ? '' : this.accountService.customer?.profileImage.url.substring(this.accountService.customer?.profileImage.url.indexOf("/") + 1));
    formData.append('percentLeft', this.circle.percentLeft.toString());
    formData.append('percentRight', this.circle.percentRight.toString());
    formData.append('percentTop', this.circle.percentTop.toString());
    formData.append('percentBottom', this.circle.percentBottom.toString());

    this.dataService.post('api/Account/ChangeProfilePicture', formData, { authorization: true }).subscribe(() => {
      this.accountService.setCustomer();
      this.fade();
      this.OpenSuccessPrompt();
    })
  }


  async OpenSuccessPrompt() {
    document.removeEventListener("keydown", this.keyDown);
    const { SuccessPromptComponent } = await import('../success-prompt/success-prompt.component');
    const { SuccessPromptModule } = await import('../success-prompt/success-prompt.module');

    this.lazyLoadingService.getComponentAsync(SuccessPromptComponent, SuccessPromptModule, this.lazyLoadingService.container)
      .then((successPrompt: SuccessPromptComponent) => {
        successPrompt.header = 'Successful Profile Picture Change';
        successPrompt.message = 'Your profile picture has been successfully changed.';
        successPrompt.profilePictureForm = this;
        this.spinnerService.show = false;
      });
  }
}