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
    public load(textBoxData: Array<TextBoxData>): void {
        this.rootElement.children = [];

        textBoxData.forEach((data: TextBoxData) => {
            this.rootElement.children.push(this.createElement(data, this.rootElement));
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


    // ----------------------------------------------------------Create Element------------------------------------------------------------------
    private createElement(textBoxData: TextBoxData, parent: Element): Element {
        let newElement!: Element;

        // Div
        if (textBoxData.elementType == ElementType.Div) {
            newElement = new DivElement(parent);
        }

        // Span
        else if (textBoxData.elementType == ElementType.Span) {
            newElement = new SpanElement(parent);
        }

        // Text
        else if (textBoxData.elementType == ElementType.Text) {
            const textElement = new TextElement(parent, textBoxData.text as string);

            newElement = textElement;
        }

        // Break
        else if (textBoxData.elementType == ElementType.Break) {
            newElement = new BreakElement(parent);
        }

        // Unordered List
        else if (textBoxData.elementType == ElementType.UnorderedList) {
            newElement = new UnorderedListElement(parent);
        }

        // Ordered List
        else if (textBoxData.elementType == ElementType.OrderedList) {
            newElement = new OrderedListElement(parent);
        }

        // List Item
        else if (textBoxData.elementType == ElementType.ListItem) {
            newElement = new ListItemElement(parent);
        }

        // Anchor
        else if (textBoxData.elementType == ElementType.Anchor) {
            newElement = new AnchorElement(parent, textBoxData.link!);
        }

        // Styles
        if (textBoxData.styles) newElement.styles = textBoxData.styles;

        // Indent
        if (textBoxData.indent) newElement.indent = textBoxData.indent;

        // Create the children
        if (textBoxData.children) {
            textBoxData.children.forEach((childElement: TextBoxData) => {
                newElement.children.push(this.createElement(childElement, newElement));
            });
        }

        return newElement;
    }
}