import { Style } from "widgets";
import { SelectedElementOnDeletion } from "./enums";
import { SelectedElement } from "./selected-element";

export abstract class Element {
    public id!: string;
    public parent!: Element;
    public styles!: Array<Style>;
    public children: Array<Element> = [];

    



    constructor() {
        this.id = Math.random().toString(36).substring(2);
    }

    setStyles(htmlElement: HTMLElement) {
        if (this.styles) {
            this.styles.forEach((x: any) => {
                htmlElement.style[x.style] = x.value;
            });
        }
    }

    setHtmlElement(htmlElement: HTMLElement, parent: HTMLElement) {
        htmlElement.id = this.id;
        parent.appendChild(htmlElement);

        this.setStyles(htmlElement);

        if (this.children.length > 0) {
            this.children.forEach((element: Element) => {
                element.create(htmlElement);
            });
        }
    }

    deleteChild(child: Element, selectedChildOnDeletion: SelectedElementOnDeletion): Element | null {
        const index = this.children.findIndex(x => x == child);
        let selectedChild!: Element | null;

        // Previous
        if (selectedChildOnDeletion == SelectedElementOnDeletion.Previous) {
            selectedChild = this.children[index].getPreviousElement();
            if (selectedChild) selectedChild = selectedChild.getLastTextElement();

            // Next
        } else if (selectedChildOnDeletion == SelectedElementOnDeletion.Next) {
            selectedChild = this.children[index].getNextElement();
            if (selectedChild) selectedChild = selectedChild.getFirstTextElement();
        }



        this.children.splice(index, 1);

        if (this.children.length == 0) {
            return this.parent.deleteChild(this, selectedChildOnDeletion);
        }

        return selectedChild;
    }


    getLastTextElement(): Element {
        if (this.children.length == 0) return this;

        let child = this.children[this.children.length - 1];

        if (child.children.length > 0) {
            child = child.getLastTextElement();
        }

        return child;
    }


    getFirstTextElement(): Element {
        if (this.children.length == 0) return this;

        let child = this.children[0];

        if (child.children.length > 0) {
            child = child.getFirstTextElement();
        }

        return child;
    }


    getAncestorElement(): Element {
        if (this.parent.parent == null) {
            return this;
        }

        return this.parent.getAncestorElement();
    }


    getPreviousElement(): Element | null {
        if (this.parent.parent == null) return null;
        const index = this.parent.children.findIndex(x => x == this);

        if (index == 0) {
            return this.parent.getPreviousElement();
        }

        let element = this.parent.children[index - 1];
        if (element.children.length > 0) {
            element = element.children[element.children.length - 1];
        }

        return element;
    }


    getNextElement(): Element | null {
        if (!this.parent) return null;
        const index = this.parent.children.findIndex(x => x == this);

        if (index == this.parent.children.length - 1) {
            return this.parent.getNextElement();
        }

        return this.parent.children[index + 1];
    }

    abstract create(parent: HTMLElement): void;
    abstract onKeydown(key: string, offset: number): SelectedElement;
    abstract setSelectedElement(offset: number): SelectedElement;
}