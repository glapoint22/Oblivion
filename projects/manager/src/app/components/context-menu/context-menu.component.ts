import { Component, OnInit } from '@angular/core';
import { LazyLoad } from 'common';

@Component({
  selector: 'context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss']
})
export class ContextMenuComponent extends LazyLoad {
  public xPos!: number;
  public yPos!: number;
}