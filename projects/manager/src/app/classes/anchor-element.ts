import { NodeType } from "widgets";
import { Element } from "./element";
import { SelectedElement } from "./selected-element";

export class AnchorElement extends Element {

    constructor(public link: string) {
        super();
        this.nodeType = NodeType.A;
    }


    setSelectedElement(offset: number): SelectedElement {
        throw new Error("Method not implemented.");
    }

    createHtml(parent: HTMLElement): void {
        const anchorElement = document.createElement('a');

        anchorElement.href = this.link;
        anchorElement.target = '_blank';
        this.setHtmlElement(anchorElement, parent);
    }


    onKeydown(key: string, offset: number): SelectedElement {
        let selectedElement!: SelectedElement;

        if (key == 'Delete') {
            const element = this.getFirstChild();

            selectedElement = element.onKeydown(key, offset);
        }

        return selectedElement;
    }


    createElement(): Element {
        return new AnchorElement(this.link);
    }

    // copyElement(parent: Element): Element {
    //     const anchorElement = new AnchorElement(this.link);

    //     anchorElement.parent = parent;
    //     anchorElement.styles = this.styles;
    //     this.children.forEach((child: Element) => {
    //         anchorElement.children.push(child.copyElement(anchorElement));
    //     });

    //     return anchorElement;
    // }
}