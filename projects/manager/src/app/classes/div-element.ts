import { NodeType } from "widgets";
import { Element } from "./element";
import { SelectedElement } from "./selected-element";

export class DivElement extends Element {

    constructor() {
        super();
        this.nodeType = NodeType.Div;
    }

    // copyElement(parent: Element): Element {
    //     const divElement = new DivElement();

    //     divElement.parent = parent;
    //     divElement.styles = this.styles;
    //     this.children.forEach((child: Element) => {
    //         divElement.children.push(child.copyElement(divElement));
    //     });

    //     return divElement;
    // }



    createElement(): Element {
        return new DivElement();
    }


    createHtml(parent: HTMLElement): void {
        const divElement = document.createElement('div');

        this.setHtmlElement(divElement, parent);
    }


    onKeydown(key: string, offset: number): SelectedElement {
        throw new Error("Method not implemented.");
    }



    setSelectedElement(offset: number): SelectedElement {
        return new SelectedElement(this.id, 0);
    }
}