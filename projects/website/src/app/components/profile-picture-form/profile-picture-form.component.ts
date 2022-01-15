import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { LazyLoad } from '../../classes/lazy-load';
import { AccountService } from '../../services/account/account.service';
import { DataService } from '../../services/data/data.service';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';
import { SuccessPromptComponent } from '../success-prompt/success-prompt.component';

@Component({
  selector: 'profile-picture-form',
  templateUrl: './profile-picture-form.component.html',
  styleUrls: ['./profile-picture-form.component.scss']
})
export class ProfilePictureFormComponent extends LazyLoad {
  constructor(private dataService: DataService, private accountService: AccountService, private lazyLoadingService: LazyLoadingService) {
    super();
  }

  private scaleValue: number = 1;
  private initialPicWidth!: number;
  private initialPicHeight!: number;
  private pivot = { x: 0, y: 0 };
  private scale = { left: 0, top: 0, width: 0, height: 0 };

  public imageFile!: Blob;
  public picLoaded!: boolean;
  public dragMessageVisible: boolean = true;
  public picMoveStartX!: number | null;
  public picMoveStartY!: number | null;
  public minusButtonDisabled: boolean = true;
  public zoomHandleMoveStartPos!: number | null;
  public plusButtonDisabled!: boolean;
  public circle = { left: 0, top: 0, bottom: 0, right: 0, size: 0 };

  @ViewChild('zoomBar', { static: false }) zoomBar!: ElementRef<HTMLElement>;
  @ViewChild('picContainer', { static: false }) picContainer!: ElementRef<HTMLElement>;
  @ViewChild('pic', { static: false }) pic!: ElementRef<HTMLImageElement>;
  @ViewChild('circleOverlay', { static: false }) circleOverlay!: ElementRef<HTMLElement>;
  @ViewChild('zoomHandle', { static: false }) zoomHandle!: ElementRef<HTMLElement>;


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
    const size: number = this.getCircleOverlayDiameter();


    // If the pic's origianl width is larger than its original height
    if (this.pic.nativeElement.naturalWidth > this.pic.nativeElement.naturalHeight) {
      // Get the ratio of width to height
      let ratio = this.pic.nativeElement.naturalWidth / this.pic.nativeElement.naturalHeight;

      // Redefine the dimensions of the pic
      this.pic.nativeElement.style.height = size + "px";
      this.pic.nativeElement.style.width = (size * ratio) + "px";
      this.pic.nativeElement.style.top = ((this.picContainer.nativeElement.offsetHeight / 2) - (size / 2)) + "px";
      this.pic.nativeElement.style.left = ((this.picContainer.nativeElement.offsetWidth / 2) - (this.pic.nativeElement.offsetWidth / 2)) + "px";

      // But if the pic's origianl height is larger than its original width
    } else {

      // Get the ratio of height to width
      let ratio = this.pic.nativeElement.naturalHeight / this.pic.nativeElement.naturalWidth;

      // Redefine the dimensions of the pic
      this.pic.nativeElement.style.width = size + "px";
      this.pic.nativeElement.style.height = (size * ratio) + "px";
      this.pic.nativeElement.style.left = ((this.picContainer.nativeElement.offsetWidth / 2) - (size / 2)) + "px";
      this.pic.nativeElement.style.top = ((this.picContainer.nativeElement.offsetHeight / 2) - (this.pic.nativeElement.offsetHeight / 2)) + "px";
    }

    // Get the initial width and height of the pic (used for scaling)
    this.initialPicWidth = this.pic.nativeElement.offsetWidth;
    this.initialPicHeight = this.pic.nativeElement.offsetHeight;

    // Set the pic scaling starting values
    this.scale.left = this.pic.nativeElement.offsetLeft;
    this.scale.top = this.pic.nativeElement.offsetTop;
    this.scale.width = this.pic.nativeElement.offsetWidth;
    this.scale.height = this.pic.nativeElement.offsetHeight;
    this.pivot.x = ((this.picContainer.nativeElement.offsetWidth / 2) - this.scale.left) / this.scale.width;
    this.pivot.y = ((this.picContainer.nativeElement.offsetHeight / 2) - this.scale.top) / this.scale.height;

    // Set the circle overlay size
    this.circleOverlay.nativeElement.style.maxWidth = size + "px";
    this.circleOverlay.nativeElement.style.maxHeight = size + "px";
    this.circleOverlay.nativeElement.style.left = ((this.picContainer.nativeElement.offsetWidth / 2) - (this.circleOverlay.nativeElement.offsetWidth / 2)) + "px";
    this.circleOverlay.nativeElement.style.top = ((this.picContainer.nativeElement.offsetHeight / 2) - (this.circleOverlay.nativeElement.offsetHeight / 2)) + "px";

    // Set the circle overlay boundarys
    this.circle.left = (this.picContainer.nativeElement.offsetWidth / 2) - (this.circleOverlay.nativeElement.offsetWidth / 2);
    this.circle.top = (this.picContainer.nativeElement.offsetHeight / 2) - (this.circleOverlay.nativeElement.offsetHeight / 2);
    this.circle.right = this.circle.left + this.circleOverlay.nativeElement.offsetWidth;
    this.circle.bottom = this.circle.top + this.circleOverlay.nativeElement.offsetHeight;
    this.circle.size = this.circleOverlay.nativeElement.offsetWidth;
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

      this.scale.left = this.pic.nativeElement.offsetLeft;
      this.scale.top = this.pic.nativeElement.offsetTop;
      this.scale.width = this.pic.nativeElement.offsetWidth;
      this.scale.height = this.pic.nativeElement.offsetHeight;
      this.pivot.x = ((this.picContainer.nativeElement.offsetWidth / 2) - this.scale.left) / this.scale.width;
      this.pivot.y = ((this.picContainer.nativeElement.offsetHeight / 2) - this.scale.top) / this.scale.height;
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
      this.scale.left = this.pic.nativeElement.offsetLeft;
      this.scale.top = this.pic.nativeElement.offsetTop;
      this.scale.width = this.pic.nativeElement.offsetWidth;
      this.scale.height = this.pic.nativeElement.offsetHeight;
      this.pivot.x = ((this.picContainer.nativeElement.offsetWidth / 2) - this.scale.left) / this.scale.width;
      this.pivot.y = ((this.picContainer.nativeElement.offsetHeight / 2) - this.scale.top) / this.scale.height;
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


  scalePic() {
    let zoomHandleLeft = this.zoomHandle.nativeElement.offsetLeft;
    let zoomBarWidth = 2.3 / (this.zoomBar.nativeElement.offsetWidth);
    this.scaleValue = 1 + (zoomHandleLeft * zoomBarWidth);

    this.pic.nativeElement.style.width = (this.initialPicWidth * this.scaleValue) + "px";
    this.pic.nativeElement.style.height = (this.initialPicHeight * this.scaleValue) + "px";
    this.pic.nativeElement.style.left = (this.scale.left - ((this.pic.nativeElement.offsetWidth - this.scale.width)) * this.pivot.x) + "px";
    this.pic.nativeElement.style.top = (this.scale.top - ((this.pic.nativeElement.offsetHeight - this.scale.height)) * this.pivot.y) + "px";

    this.setPicBoundarys();
  }


  getCircleOverlayDiameter(): number {
    let circleOverlayDiameter: number;

    // If the height of the pic container is less than its width
    if (this.picContainer.nativeElement.offsetHeight < this.picContainer.nativeElement.offsetWidth) {
      // And if its height is less than 300
      if (this.picContainer.nativeElement.offsetHeight < 300) {
        // Set the diameter of the circle overlay to the height of the pic container
        circleOverlayDiameter = this.picContainer.nativeElement.offsetHeight;

        // But if the height of the pic container is 300 or more
      } else {
        // Set the diameter of the circle overlay to 300
        circleOverlayDiameter = 300;
      }

      // Or if the width of the pic container is less than its height
    } else {

      // And if its width is less than 300
      if (this.picContainer.nativeElement.offsetWidth < 300) {
        // Set the diameter of the circle overlay to the width of the pic container
        circleOverlayDiameter = this.picContainer.nativeElement.offsetWidth;

        // But if the width of the pic container is 300 or more
      } else {
        // Set the diameter of the circle overlay to 300
        circleOverlayDiameter = 300;
      }
    }
    return circleOverlayDiameter;
  }



  onNewImageButtonClick(fileInput: HTMLInputElement) {
    // Clear the picture select input (This is so the same filename can be re-entered again and again)
    fileInput.value = '';
    // Open the file explorer window
    fileInput.click();
  }




  getImage(image: Blob) {
    const reader = new FileReader();
    this.picLoaded = false;

    reader.onload = () => {
      this.pic.nativeElement.src = reader.result!.toString();
    };

    window.setTimeout(() => {// Temp
      reader.readAsDataURL(image);
    }, 1000)
  }



  onSubmit() {
    const formData = new FormData()
    formData.append('newImage', this.imageFile);
    formData.append('currentImage', !this.accountService.customer?.hasProfileImage ? '' :
      this.accountService.customer?.profileImage.url.substring(this.accountService.customer?.profileImage.url.indexOf("/") + 1));
    formData.append('width', Math.round(this.pic.nativeElement.clientWidth * this.scaleValue).toString());
    formData.append('height', Math.round(this.pic.nativeElement.clientHeight * this.scaleValue).toString());
    formData.append('cropLeft', Math.round(((this.pic.nativeElement.clientWidth * this.scaleValue) * this.pivot.x) - 150).toString());
    formData.append('cropTop', Math.round(((this.pic.nativeElement.clientHeight * this.scaleValue) * this.pivot.y) - 150).toString());

    this.dataService.post('api/Account/ChangeProfilePicture', formData, true).subscribe(() => {
      this.accountService.setCustomer();
      this.close();
      this.OpenSuccessPrompt();
    })
  }


  async OpenSuccessPrompt() {
    const { SuccessPromptComponent } = await import('../success-prompt/success-prompt.component');
    const { SuccessPromptModule } = await import('../success-prompt/success-prompt.module');

    this.lazyLoadingService.getComponentAsync(SuccessPromptComponent, SuccessPromptModule, this.lazyLoadingService.container)
      .then((successPromptComponent: SuccessPromptComponent) => {
        successPromptComponent.header = 'Successful Profile Picture Change';
        successPromptComponent.message = 'Your profile picture has been successfully changed.';
      });
  }
}