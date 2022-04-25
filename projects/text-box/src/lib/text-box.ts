import { AnchorElement } from "./anchor-element";
import { BreakElement } from "./break-element";
import { DivElement } from "./div-element";
import { Element } from "./element";
import { ElementType } from "./element-type";
import { ListItemElement } from "./list-item-element";
import { OrderedListElement } from "./ordered-list-element";
import { RootElement } from "./root-element";
import { SpanElement } from "./span-element";
import { TextBoxData } from "./text-box-data";
import { TextElement } from "./text-element";
import { UnorderedListElement } from "./unordered-list-element";

export class TextBox {
    protected rootElement: RootElement = new RootElement();

    constructor(protected htmlRootElement: HTMLElement) { }

    // ---------------------------------------------------Load-----------------------------------------------------
    public load(elements: Array<TextBoxData>): void {
        this.rootElement.children = [];

        elements.forEach((element: TextBoxData) => {
            this.rootElement.children.push(this.createElement(element, this.rootElement));
        });
    }





    // ---------------------------------------------------------Render------------------------------------------------------------------
    public render(): void {
        // This will clear the root element
        if (this.rootElement.children.length > 0) {
            while (this.htmlRootElement.firstChild) {
                this.htmlRootElement.removeChild(this.htmlRootElement.firstChild);
            }
        }

        this.generateHtml();
    }




    // ---------------------------------------------------------Generate Html------------------------------------------------------------------
    protected generateHtml() {
        // Generate the html for each element
        this.rootElement.children.forEach((element: Element) => {
            element.generateHtml(this.htmlRootElement);
        });
    }


    // ---------------------------------------------------Create Element-----------------------------------------------------
    private createElement(currentElement: TextBoxData, parent: Element): Element {
        let newElement!: Element;

        // Div
        if (currentElement.elementType == ElementType.Div) {
            newElement = new DivElement(parent);
        }

        // Span
        else if (currentElement.elementType == ElementType.Span) {
            newElement = new SpanElement(parent);
        }

        // Text
        else if (currentElement.elementType == ElementType.Text) {
            const textElement = new TextElement(parent, currentElement.text as string);

            newElement = textElement;
        }

        // Break
        else if (currentElement.elementType == ElementType.Break) {
            newElement = new BreakElement(parent);
        }

        // Unordered List
        else if (currentElement.elementType == ElementType.UnorderedList) {
            newElement = new UnorderedListElement(parent);
        }

        // Ordered List
        else if (currentElement.elementType == ElementType.OrderedList) {
            newElement = new OrderedListElement(parent);
        }

        // List Item
        else if (currentElement.elementType == ElementType.ListItem) {
            newElement = new ListItemElement(parent);
        }

        // Anchor
        else if (currentElement.elementType == ElementType.Anchor) {
            newElement = new AnchorElement(parent, currentElement.link!);
        }

        // Styles
        if (currentElement.styles) newElement.styles = currentElement.styles;

        // Indent
        if (currentElement.indent) newElement.indent = currentElement.indent;

        // Create the children
        if (currentElement.children) {
            currentElement.children.forEach((childElement: TextBoxData) => {
                newElement.children.push(this.createElement(childElement, newElement));
            });
        }

        return newElement;
    }
}