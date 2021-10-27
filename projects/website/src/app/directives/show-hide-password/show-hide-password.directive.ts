import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[showHidePassword]'
})
export class ShowHidePasswordDirective {
  constructor(private el: ElementRef<HTMLElement>) { }

  @HostListener('click') onClick() {
    let inputElement: HTMLInputElement = this.el.nativeElement.previousElementSibling as HTMLInputElement;
    let iconElement: HTMLElement = this.el.nativeElement.firstChild as HTMLElement;


    if(inputElement.type == 'text') {
      inputElement.type = 'password';
      iconElement.className = "hide-password";

    }else {
      inputElement.type = 'text';
      iconElement.className = "show-password";
    }
  }
}