import { Directive } from "@angular/core";
import { Meta, Title } from "@angular/platform-browser";

@Directive()
export class Page {

    constructor(private titleService: Title, private metaService: Meta) { }

    setPage(title: string, description: string): void {
        this.titleService.setTitle('Niche Shack - ' + title);
        this.metaService.addTag({ name: 'description', content: description });
    }
}