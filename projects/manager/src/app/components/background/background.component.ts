import { KeyValue } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Background } from 'widgets';

@Component({
  selector: 'background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.scss']
})
export class BackgroundComponent implements OnInit {
  @Input() background!: Background;
  @Output() onChange: EventEmitter<void> = new EventEmitter();
  public repeatOptions!: Array<KeyValue<string, string>>;
  public positionOptions!: Array<KeyValue<string, string>>;
  public attachmentOptions!: Array<KeyValue<string, string>>;

  ngOnInit() {
    // Position options
    this.positionOptions = [
      {
        key: 'Left Top',
        value: 'left top'
      },
      {
        key: 'Center Top',
        value: 'center top'
      },
      {
        key: 'Right Top',
        value: 'right top'
      },
      {
        key: 'Left Center',
        value: 'left center'
      },
      {
        key: 'Center Center',
        value: 'center center'
      },
      {
        key: 'Right Center',
        value: 'right center'
      },
      {
        key: 'Left Bottom',
        value: 'left bottom'
      },
      {
        key: 'Center Bottom',
        value: 'center bottom'
      },
      {
        key: 'Right Bottom',
        value: 'right bottom'
      }
    ]



    // Repeat options
    this.repeatOptions = [
      {
        key: 'Repeat',
        value: 'repeat'
      },
      {
        key: 'Repeat X',
        value: 'repeat-x'
      },
      {
        key: 'Repeat Y',
        value: 'repeat-y'
      },
      {
        key: 'No Repeat',
        value: 'no-repeat'
      },
      {
        key: 'Space',
        value: 'space'
      },
      {
        key: 'Round',
        value: 'round'
      }
    ]





    // Attachment options
    this.attachmentOptions = [
      {
        key: 'Scroll',
        value: 'scroll'
      },
      {
        key: 'Fixed',
        value: 'fixed'
      },
      {
        key: 'Local',
        value: 'local'
      }
    ]
  }
}