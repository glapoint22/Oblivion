import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MessageService } from '../../services/message/message.service';

@Component({
  selector: 'message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {
  @Input() top!: number;
  @Output() onMessageChange: EventEmitter<void> = new EventEmitter();
  @ViewChild('messageContainer') private messageContainer!: ElementRef<HTMLElement>;

  // Message
  private _message!: string | null;
  public get message(): string | null {
    return this._message;
  }

  // Height
  public get height(): number {
    return this.messageContainer && this._message ? this.messageContainer.nativeElement.clientHeight : 0;
  }

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.messageService.getMessage()
      .subscribe((message: string | null) => {
        if (message) {
          this._message = message;
          setTimeout(() => {
            this.onMessageChange.emit();
          });
        }
      });
  }


  onCloseButtonClick() {
    this.messageService.closeMessage();
    this._message = null;
    this.onMessageChange.emit();
  }
}