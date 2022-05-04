import { ApplicationRef, Component, Input, OnChanges } from '@angular/core';
import { TextBoxDev } from 'text-box';

@Component({
  selector: 'text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss']
})
export class TextComponent implements OnChanges {
  @Input() textBox!: TextBoxDev;

  constructor(private appRef: ApplicationRef) { }

  // ---------------------------------------------------------On Changes------------------------------------------------------------------
  ngOnChanges(): void {
    if (this.textBox) {
      this.textBox.setSelectedClasses();
      this.textBox.onSelection.subscribe(() => this.appRef.tick());
    }
  }
}