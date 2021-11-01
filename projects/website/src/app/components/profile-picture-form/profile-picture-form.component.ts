import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Modal } from '../../classes/modal';

@Component({
  selector: 'profile-picture-form',
  templateUrl: './profile-picture-form.component.html',
  styleUrls: ['./profile-picture-form.component.scss']
})
export class ProfilePictureFormComponent extends Modal {
  @ViewChild('profilePic', { static: false }) profilePic!: ElementRef<HTMLElement>;

  onSubmit() {

  }

  ngAfterViewInit() {
    this.onWindowResize();
  }


  @HostListener('window:resize')
  onWindowResize() {
    if (this.profilePic != null) {
      this.profilePic.nativeElement.style.width = this.profilePic.nativeElement.clientHeight + 'px';
    }
  }
}
