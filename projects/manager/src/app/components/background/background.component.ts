import { KeyValue } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DataService } from 'common';
import { Background } from 'widgets';
import { ImageReference } from '../../classes/image-reference';

@Component({
  selector: 'background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.scss']
})
export class BackgroundComponent implements OnInit {
  @Input() background!: Background;
  @Input() toggleable: boolean = true;
  @Input() imageReference!: ImageReference;
  @Output() onChange: EventEmitter<void> = new EventEmitter();
  public repeatOptions!: Array<KeyValue<string, string>>;
  public positionOptions!: Array<KeyValue<string, string>>;
  public attachmentOptions!: Array<KeyValue<string, string>>;

  constructor(private dataService: DataService) { }

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


  onDisable() {
    if (this.background.image && this.background.image.src) {
      this.imageReference.imageId = this.background.image.id;
      this.imageReference.imageSizeType = this.background.image.imageSizeType;
      this.dataService.post('api/Media/ImageReferences/Remove', [this.imageReference]).subscribe();
      this.background.image.src = null!;
      this.background.image.id = null!;
      this.background.image.thumbnail = null!;
      this.background.image.name = null!;
    }
    this.onChange.emit();
  }
}