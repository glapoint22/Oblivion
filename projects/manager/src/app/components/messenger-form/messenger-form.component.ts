import { Component, ElementRef, ViewChild } from '@angular/core';
import { DataService, LazyLoad, LazyLoadingService } from 'common';

@Component({
  selector: 'messenger-form',
  templateUrl: './messenger-form.component.html',
  styleUrls: ['./messenger-form.component.scss']
})
export class MessengerFormComponent extends LazyLoad {
  @ViewChild('textarea') textarea!: ElementRef<HTMLTextAreaElement>;

  constructor(lazyLoadingService: LazyLoadingService, private dataService: DataService) {
    super(lazyLoadingService);
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.dataService.get('api/Message', undefined, {
      authorization: true
    }).subscribe((message: any) => {
      this.textarea.nativeElement.value = message.text;
    });
  }

  onSubmit() {
    this.dataService.post('api/Message', {
      text: this.textarea.nativeElement.value
    }, {
      authorization: true
    }).subscribe();
    this.close();
  }
}