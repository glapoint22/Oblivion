import { NodeType } from "widgets";
import { Element } from "./element";
import { SelectedElement } from "./selected-element";

export class ListItemElement extends Element {

    constructor() {
        super();
        this.nodeType = NodeType.Li;
    }

    setSelectedElement(offset: number): SelectedElement {
        return new SelectedElement(this.id, 0);
    }
    onKeydown(key: string, offset: number): SelectedElement {
        throw new Error("Method not implemented.");
    }
    createHtml(parent: HTMLElement): void {
        const listItemElement = document.createElement('li');

        this.setHtmlElement(listItemElement, parent);
    }


    createElement(): Element {
        return new ListItemElement();
    }

    // copyElement(parent: Element): Element {
    //     const listItemElement = new ListItemElement();

    //     listItemElement.parent = parent;
    //     listItemElement.styles = this.styles;
    //     this.children.forEach((child: Element) => {
    //         listItemElement.children.push(child.copyElement(listItemElement));
    //     });

    //     return listItemElement;
    // }

}