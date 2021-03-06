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
  @Output() onOpen: EventEmitter<void> = new EventEmitter();
  @ViewChild('content') content!: ElementRef;
  public expanded!: boolean;
  public contentMaxHeight!: number;


  click(input: HTMLInputElement) {
    this.contentMaxHeight = this.content.nativeElement.scrollHeight;

    if (input.checked) {
      window.setTimeout(() => {
        this.expanded = false;
      });
    } else {
      this.expanded = true;
      this.onOpen.emit();
    }
  }


  transitionend() {
    if (this.expanded) this.contentMaxHeight = null!;
  }
}