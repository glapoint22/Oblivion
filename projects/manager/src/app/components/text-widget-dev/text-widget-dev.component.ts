import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TextWidgetComponent } from 'widgets';
import { Text } from '../../classes/text';
import { WidgetService } from '../../services/widget/widget.service';

@Component({
  selector: 'text-widget-dev',
  templateUrl: './text-widget-dev.component.html',
  styleUrls: ['./text-widget-dev.component.scss']
})
export class TextWidgetDevComponent extends TextWidgetComponent implements OnInit {
  @ViewChild('textElement') textElement!: ElementRef<HTMLElement>;
  public text!: Text;

  constructor(public widgetService: WidgetService) { super() }

  ngOnInit(): void {
    super.ngOnInit();
    this.height = 64;
  }

  setText() {
    this.text = new Text(this.textData, this.textElement.nativeElement);
    this.text.render();
  }
}