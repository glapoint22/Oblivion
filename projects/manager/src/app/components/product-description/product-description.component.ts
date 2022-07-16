import { ApplicationRef, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { DataService } from 'common';
import { debounceTime, Subject } from 'rxjs';
import { TextBoxData, TextBoxDev } from 'text-box';
import { Product } from '../../classes/product';

@Component({
  selector: 'product-description',
  templateUrl: './product-description.component.html',
  styleUrls: ['./product-description.component.scss']
})
export class ProductDescriptionComponent {
  @Input() product!: Product;
  @ViewChild('iframe') iframe!: ElementRef<HTMLIFrameElement>;
  public height: number = 32;
  public textBox!: TextBoxDev;
  public showToolbar!: boolean;
  private saveData = new Subject<void>();

  constructor(private appRef: ApplicationRef, private dataService: DataService) { }


  // --------------------------------------------------------------------------- Ng On Init ---------------------------------------------------------
  public ngOnInit(): void {
    this.saveData
      .pipe(debounceTime(500))
      .subscribe(() => {
        this.dataService.put('api/Products/Description', {
          productId: this.product.id,
          description: JSON.stringify(this.textBox.getData())
        }).subscribe();
      });
  }



  // ------------------------------------------------------------------------ Ng After View Init ------------------------------------------------------
  ngAfterViewInit() {
    // This is the root element for the description
    this.iframe.nativeElement.srcdoc =
      `<div style="color: #dadada; outline: none;
        cursor: text;
        user-select: none;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 14px;
        min-height: 32px;
        "contenteditable="true" spellcheck="false"></div>`;


    // When the iframe loads
    this.iframe.nativeElement.onload = () => {
      const body = this.iframe.nativeElement.contentDocument?.body!;
      const htmlRootElement = body.firstElementChild as HTMLElement;

      // This will get all styling
      this.iframe.nativeElement.contentDocument!.head.innerHTML = document.head.innerHTML;

      // Set up an event listener to show and hide the toolbar
      htmlRootElement.addEventListener('mousedown', () => {
        if (!this.showToolbar) {
          this.showToolbar = true;
          window.addEventListener('mousedown', () => {
            this.showToolbar = false;
            this.appRef.tick();
          }, { once: true });
        }
      });

      // Instantiate the text box
      this.textBox = new TextBoxDev(htmlRootElement);

      this.height = htmlRootElement.getBoundingClientRect().height;

      // Load the description
      if (this.product.description) {
        const textBoxData: Array<TextBoxData> = JSON.parse(this.product.description);
        this.textBox.load(textBoxData);
        window.setTimeout(() => {
          this.update(htmlRootElement);
        });

      }

      // Render the text box
      this.textBox.render();


      // On selection
      this.textBox.onSelection.subscribe(() => {
        this.update(htmlRootElement);
      });

      // On Change
      this.textBox.onChange.subscribe(() => {
        this.update(htmlRootElement);
        this.saveData.next();
      });
    }
  }



  

  // ------------------------------------------------------------------------ Update --------------------------------------------------------
  update(htmlRootElement: HTMLElement) {
    this.height = htmlRootElement.getBoundingClientRect().height;
    this.appRef.tick();
  }
}