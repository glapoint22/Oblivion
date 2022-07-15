import { ApplicationRef, Component, ElementRef, ViewChild } from '@angular/core';
import { TextBoxDev } from 'text-box';

@Component({
  selector: 'product-description',
  templateUrl: './product-description.component.html',
  styleUrls: ['./product-description.component.scss']
})
export class ProductDescriptionComponent {
  @ViewChild('iframe') iframe!: ElementRef<HTMLIFrameElement>;
  public height: number = 80;
  public textBox!: TextBoxDev;
  public showToolbar!: boolean;

  constructor(private appRef: ApplicationRef) { }



  ngAfterViewInit() {
    this.iframe.nativeElement.srcdoc =
      `<div style="color: #dadada; outline: none;
        cursor: text;
        user-select: none;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 14px;
        min-height: 80px;
        border: 1px dashed #505050"contenteditable="true" spellcheck="false"></div>`;



    this.iframe.nativeElement.onload = () => {
      const body = this.iframe.nativeElement.contentDocument?.body!;
      const htmlRootElement = body.firstElementChild as HTMLElement;

      this.iframe.nativeElement.contentDocument!.head.innerHTML = document.head.innerHTML;

      htmlRootElement.addEventListener('mousedown', () => {
        if (!this.showToolbar) {
          this.showToolbar = true;
          window.addEventListener('mousedown', () => {
            this.showToolbar = false;
            this.appRef.tick();
          }, { once: true });
        }

      });
      this.textBox = new TextBoxDev(htmlRootElement);

      this.height = htmlRootElement.getBoundingClientRect().height;
      body.style.margin = '0px';
      this.textBox.render();



      this.textBox.onSelection.subscribe(() => {
        this.update(htmlRootElement);
      });

      this.textBox.onChange.subscribe(() => {
        this.update(htmlRootElement);
      });
    }
  }


  update(htmlRootElement: HTMLElement) {
    this.height = htmlRootElement.getBoundingClientRect().height;
    this.appRef.tick();
  }
}