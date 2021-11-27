import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { LazyLoad } from '../../classes/lazy-load';

@Component({
  selector: 'profile-picture-form',
  templateUrl: './profile-picture-form.component.html',
  styleUrls: ['./profile-picture-form.component.scss']
})
export class ProfilePictureFormComponent extends LazyLoad {
  @ViewChild('profilePic', { static: false }) profilePic!: ElementRef<HTMLElement>;

  onSubmit() {

  }

  // ngAfterViewInit() {
  //   this.onWindowResize();
  // }


  // @HostListener('window:resize')
  // onWindowResize() {
  //   if (this.profilePic != null) {
  //     this.profilePic.nativeElement.style.width = this.profilePic.nativeElement.clientHeight + 'px';
  //   }
  // }
}