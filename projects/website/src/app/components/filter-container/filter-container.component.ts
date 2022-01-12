import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'filter-container',
  templateUrl: './filter-container.component.html',
  styleUrls: ['./filter-container.component.scss']
})
export class FilterContainerComponent {
  @Input() caption!: string;
  @ViewChild('content') content!: ElementRef;
  public expanded: boolean = true;
  public contentMaxHeight!: number | null;
  public contentPadding: number = 12;

  onClick(input: HTMLInputElement) {
    this.contentMaxHeight = this.content.nativeElement.scrollHeight + (this.contentPadding * 2);

    if (input.checked) {
      window.setTimeout(() => {
        this.expanded = false;
      });
    } else {
      this.expanded = true;
    }
  }


  transitionend() {
    if (this.expanded) this.contentMaxHeight = null;
  }
}