import { NodeType } from "widgets";
import { Element } from "./element";

export class ListItemElement extends Element {

    constructor(parent: Element) {
        super(parent);
        this.nodeType = NodeType.Li;
    }



    createHtml(parent: HTMLElement): void {
        const listItemElement = document.createElement('li');

        this.setHtmlElement(listItemElement, parent);
    }


    createElement(parent: Element): Element {
        return new ListItemElement(parent);
    }

    setIndent(value: number) {
        if (value == 1) {
            const index = this.parent.children.findIndex(x => x == this);
            const list = this.parent.createElement(this.parent);
            const newListItem = this.copyElement(list);

            if (newListItem) {
                list.children.push(newListItem);
                this.parent.children.splice(index, 1, list);
            }
        } 
        
        // else {
        //     if (this.parent.parent.isRoot) return;

        //     const index = this.parent.children.findIndex(x => x == this);
        //     const parentIndex = this.parent.parent.children.findIndex(x => x == this.parent);
        //     const copy = this.copyElement(this.parent.parent);

        //     if (copy) {
        //         this.parent.parent.children.splice(parentIndex + 1, 0, copy);
        //         this.parent.children.splice(index, 1);
        //     }
        // }
    }
}