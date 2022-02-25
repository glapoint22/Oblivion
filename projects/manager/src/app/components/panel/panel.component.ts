import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Enableable } from 'widgets';

@Component({
  selector: 'panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent {
  @Input() title!: string;
  @Input() enabledProperty!: Enableable;
  @Output() onChange: EventEmitter<void> = new EventEmitter();
  @ViewChild('content') content!: ElementRef;
  public expanded!: boolean;
  public contentMaxHeight!: number;
  public contentPadding: number = 14;


  click(input: HTMLInputElement) {
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
    if (this.expanded) this.contentMaxHeight = null!;
  }
}