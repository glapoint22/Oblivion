import { Component, Input, OnInit } from '@angular/core';
import { Style } from 'widgets';
import { Text } from '../../classes/text';
import { WidgetService } from '../../services/widget/widget.service';

@Component({
  selector: 'text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss']
})
export class TextComponent implements OnInit {
  @Input() text!: Text;
  public bold: Style = new Style('font-weight', '700');
  public italic: Style = new Style('font-style', 'italic');
  public underline: Style = new Style('text-decoration', 'underline');

  constructor(public widgetService: WidgetService) { }

  ngOnInit(): void {
  }

}
