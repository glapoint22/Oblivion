import { Component, Input } from '@angular/core';
import { PricePointComponent } from '../price-point.component';
import { DataService, LazyLoadingService } from 'common';
import { ProductService } from 'projects/manager/src/app/services/product/product.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { debounceTime, fromEvent } from 'rxjs';

@Component({
    selector: 'price-point-text',
    templateUrl: './price-point-text.component.html',
    styleUrls: ['./price-point-text.component.scss']
})
export class PricePointTextComponent extends PricePointComponent {
    public html!: SafeHtml;

    public showTextEditor!: boolean;

    constructor(dataService: DataService, lazyLoadingService: LazyLoadingService, productService: ProductService, private sanitizer: DomSanitizer) {
        super(dataService, lazyLoadingService, productService);
    }


    ngOnChanges() {
        if (this.pricePoint.text) {
            this.html = this.sanitizer.bypassSecurityTrustHtml(this.pricePoint.text);
        }
    }


    onInputChange(value: string) {
        this.pricePoint.text = value;
        this.html = this.sanitizer.bypassSecurityTrustHtml(this.pricePoint.text);
    }


    onTextEditorButtonClick() {
        this.showTextEditor = !this.showTextEditor;

        if (this.showTextEditor) {
            setTimeout(() => {
                const textEditor = document.getElementById('text-editor') as HTMLTextAreaElement;

                fromEvent(textEditor, 'input')
                    .pipe(debounceTime(500))
                    .subscribe(() => this.updatePricePoint(this.pricePoint));
            });
        }
    }
}