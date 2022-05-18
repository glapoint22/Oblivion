import { Link, LinkType } from "common";
import { Element } from "./element";
import { ElementType } from "./element-type";

export class AnchorElement extends Element {

    constructor(public parent: Element, public link: Link) {
        super();
        this.elementType = ElementType.Anchor;
    }

    // ---------------------------------------------------Generate Html-----------------------------------------------------
    public generateHtml(parent: HTMLElement, includeId?: boolean): void {
        const anchorElement = document.createElement('a');

        if (this.link.linkType == LinkType.WebAddress) {
            anchorElement.href = this.link.url;
            anchorElement.target = '_blank';
        } else {
            anchorElement.setAttribute('routerLink', this.link.url);
        }

        this.setHtmlElement(anchorElement, parent, includeId!);
    }



    // ---------------------------------------------------Create-----------------------------------------------------
    public create(parent: Element): Element {
        return new AnchorElement(parent, this.link);
    }
}