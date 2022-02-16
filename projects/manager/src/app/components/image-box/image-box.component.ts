import { Component, DoCheck, EventEmitter, Input, OnChanges, Output } from '@angular/core';

@Component({
  selector: 'image-box',
  templateUrl: './image-box.component.html',
  styleUrls: ['./image-box.component.scss']
})
export class ImageBoxComponent implements OnChanges, DoCheck {
  @Input() image!: any;//Image;
  @Input() mediaType!: any; //MediaType
  @Input() noDelete!: boolean;
  @Output() onChange: EventEmitter<void> = new EventEmitter();
  @Output() onLoad: EventEmitter<void> = new EventEmitter();
  private currentImage!: string;

  constructor() { } // private promptService: PromptService, private popupService: PopupService


  ngDoCheck() {
    if (this.image && this.currentImage != this.image.url) {
      this.currentImage = this.image.url;
      this.onChange.emit();
    }
  }


  ngOnChanges() {
    if (this.image) this.currentImage = this.image.url;
  }

  onDeleteImageClick() {
    if (this.image.url) {
      // Prompt the user to delete the image
      let promptTitle = 'Delete Image';
      let promptMessage = 'Are you sure you want to delete this Image?';
      // this.promptService.showPrompt(promptTitle, promptMessage, this.deleteImage, this);
    }
  }

  deleteImage() {
    this.image.id = 0;
    this.image.url = null;
    this.currentImage = null!;
    this.onChange.emit();
  }

  onClick() { // sourceElement: HTMLElement
    // this.popupService.mediaType = this.mediaType;
    // this.popupService.sourceElement = sourceElement;
    // this.popupService.mediaBrowserPopup.show = !this.popupService.mediaBrowserPopup.show;
    // this.popupService.mediaBrowserPopup.media = this.image;
  }
}
