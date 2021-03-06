import { ApplicationRef, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { DataService, IProduct } from 'common';
import { debounceTime, Subject } from 'rxjs';
import { TextBoxData, TextBoxDev } from 'text-box';

@Component({
  selector: 'product-description',
  templateUrl: './product-description.component.html',
  styleUrls: ['./product-description.component.scss']
})
export class ProductDescriptionComponent {
  @Input() product!: IProduct;
  @Input() apiUrl!: string;
  @ViewChild('iframe') iframe!: ElementRef<HTMLIFrameElement>;
  public height: number = 32;
  public textBox!: TextBoxDev;
  public showToolbar!: boolean;
  private saveData = new Subject<void>();
  private mousedown!: boolean;

  constructor(private appRef: ApplicationRef, private dataService: DataService) { }


  // --------------------------------------------------------------------------- Ng On Init ---------------------------------------------------------
  public ngOnInit(): void {
    this.saveData
      .pipe(debounceTime(500))
      .subscribe(() => {
        this.dataService.put('api/Products/' + this.apiUrl, {
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
      const contentDocument = this.iframe.nativeElement.contentDocument!;
      const body = contentDocument.body!;
      const htmlRootElement = body.firstElementChild as HTMLElement;

      contentDocument.addEventListener('mousedown', () => {
        if (this.showToolbar) this.mousedown = true;
        window.dispatchEvent(new Event('mousedown'));

        if (!this.showToolbar) {
          this.showToolbar = true;
          window.removeEventListener('mousedown', mousedown);
          window.addEventListener('mousedown', mousedown);
        }
      });

      const mousedown = () => {
        if (!this.mousedown) {
          this.showToolbar = false;
          this.appRef.tick();
        }

        this.mousedown = false;
      }

      // This will get all styling
      this.iframe.nativeElement.contentDocument!.head.innerHTML = document.head.innerHTML;


      // Instantiate the text box
      this.textBox = new TextBoxDev(htmlRootElement);

      // Set the height
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