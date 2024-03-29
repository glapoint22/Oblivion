import { Component, ElementRef, ViewChild } from '@angular/core';
import { LazyLoad } from 'common';
import { Subject } from 'rxjs';

@Component({
  selector: 'value-popup',
  templateUrl: './value-popup.component.html',
  styleUrls: ['./value-popup.component.scss']
})
export class ValuePopupComponent extends LazyLoad {
  @ViewChild('valueInput') valueInput!: ElementRef<HTMLInputElement>;
  public value!: number;
  public callback!: Function;
  public onClose: Subject<void> = new Subject<void>();



  ngOnInit() {
    super.ngOnInit();
    window.addEventListener('mousedown', this.mousedown);
  }


  mousedown = () => {
    this.close();
  }


  // --------------------------------------------------- Ng After View Init ---------------------------------------------------
  ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.valueInput.nativeElement.value = this.value.toString();

    window.setTimeout(() => {
      this.valueInput.nativeElement.focus();
      this.valueInput.nativeElement.select();
    });
  }



  
  
  // ---------------------------------------------------------- On Input --------------------------------------------------------
  onInput() {
    !(/^[0-9]*$/i).test(this.valueInput.nativeElement.value) ? this.valueInput.nativeElement.value = this.valueInput.nativeElement.value.replace(/[^0-9]/ig, '') : null;

    if (this.valueInput.nativeElement.value) {
      this.value = parseInt(this.valueInput.nativeElement.value);


    } else {
      this.value = 0;
      window.setTimeout(() => {
        this.valueInput.nativeElement.value = '';
      });
    }
  }





  // ---------------------------------------------------------- On Submit --------------------------------------------------------
  onSubmit() {
    this.callback(this.value);
    this.close();
  }



  close(): void {
    super.close();
    this.onClose.next();
  }


  ngOnDestroy() {
    super.ngOnDestroy();
    window.removeEventListener('mousedown', this.mousedown);
  }
}