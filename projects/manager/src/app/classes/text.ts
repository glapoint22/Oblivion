import { NodeType, TextData } from "widgets";
import { AnchorElement } from "./anchor-element";
import { BreakElement } from "./break-element";
import { DivElement } from "./div-element";
import { Element } from "./element";
import { ListItemElement } from "./list-item-element";
import { OrderedListElement } from "./ordered-list-element";
import { SelectedElement } from "./selected-element";
import { SpanElement } from "./span-element";
import { TextElement } from "./text-element";
import { UnorderedListElement } from "./unordered-list-element";

export class Text {
    private parentElement: DivElement = new DivElement();
    private range!: Range;
    private startElement!: Element;
    private endElement!: Element;
    private commonAncestorElement!: Element;

    constructor(textData: Array<TextData>, private htmlElement: HTMLElement) {
        this.parentElement.isRoot = true;

        textData.forEach((data: TextData) => {
            this.parentElement.children.push(this.createElement(data, this.parentElement));
        });
    }


    // ---------------------------------------------------------Render------------------------------------------------------------------
    public render() {
        if (this.parentElement.children.length > 0) {
            while (this.htmlElement.firstChild) {
                this.htmlElement.removeChild(this.htmlElement.firstChild);
            }
        }

        this.htmlElement.id = this.parentElement.id;

        this.parentElement.children.forEach((element: Element) => {
            this.createHtml(element, this.htmlElement);
        });
    }





    // ---------------------------------------------------------Create Html------------------------------------------------------------------
    private createHtml(element: Element, parent: HTMLElement) {
        element.createHtml(parent);
    }



    // ---------------------------------------------------------Set Selection------------------------------------------------------------------
    setSelection() {
        const selection = window.getSelection();

        if (selection) this.range = selection.getRangeAt(0);

        if (this.range.collapsed) {
            this.startElement = this.endElement = this.commonAncestorElement = this.getElement(this.range.startContainer);
        } else {
            this.startElement = this.getElement(this.range.startContainer);
            this.endElement = this.getElement(this.range.endContainer);
            this.commonAncestorElement = this.getElement(this.range.commonAncestorContainer);
        }
    }



    // ---------------------------------------------------------On Paste------------------------------------------------------------------
    onPaste(event: ClipboardEvent) {
        event.preventDefault();
    }




    // ---------------------------------------------------------On Mousedown------------------------------------------------------------------
    public onMousedown() {
        const onMouseup = () => {
            this.setSelection();
        }

        window.addEventListener('mouseup', onMouseup, { once: true });
    }






    // ---------------------------------------------------------On Keyup------------------------------------------------------------------
    onKeyup(event: KeyboardEvent) {
        if (event.key.includes('Arrow') || (event.ctrlKey && (event.key == 'a' || event.key == 'A'))) {
            this.setSelection();
        }
    }






    // ---------------------------------------------------------On Keydown------------------------------------------------------------------
    onKeydown(event: KeyboardEvent) {
        const key = this.getKey(event);

        if (!key) return;
        event.preventDefault();

        let selectedElement!: SelectedElement;

        if (this.range.collapsed) {
            switch (key) {
                case 'Backspace':
                    selectedElement = this.startElement.onBackspace(this.range.startOffset);
                    break;

                case 'Enter':
                    selectedElement = this.startElement.onEnter(this.range.startOffset);
                    break;

                case 'Delete':
                    selectedElement = this.startElement.onDelete(this.range.startOffset);
                    break;

                case 'Tab':
                    // selectedElement = this.startElement.onTab(this.range.startOffset);
                    break;

                default:
                    selectedElement = this.startElement.onKeydown(key, this.range.startOffset);
                    break;
            }



            this.render();

            let node = document.getElementById(selectedElement.id) as Node;
            if (selectedElement.childIndex != -1) node = node.childNodes[selectedElement.childIndex] as Node;
            this.range.setStart(node, selectedElement.offset);
            this.setSelection();
        }
    }






    // ---------------------------------------------------------Get Key------------------------------------------------------------------
    getKey(event: KeyboardEvent): string | null {
        if (event.key == 'Backspace' || event.key == 'Enter' || event.key == 'Delete' || event.key == 'Tab') return event.key;

        if (!/^(?:\w|\W){1}$/.test(event.key) || event.ctrlKey) return null;

        return event.key;
    }








    // ---------------------------------------------------------Get Element------------------------------------------------------------------
    getElement(node: Node): Element {
        if (node.nodeType == 3) {
            return this.getTextElement(node.parentElement?.id as string);
        }

        return this.searchElement(this.parentElement, (node as HTMLElement).id) as Element;
    }







    // ---------------------------------------------------------Search Element------------------------------------------------------------------
    private searchElement(parentElement: Element, id: string): Element | null {
        if (parentElement.id == id) return parentElement;

        for (let i = 0; i < parentElement.children.length; i++) {
            const element = parentElement.children[i];

            if (element.id == id) {
                return element;
            }

            if (element.children.length > 0) {
                const result = this.searchElement(element, id);

                if (result != null) {
                    return result;
                }
            }
        }

        return null;
    }




    // ---------------------------------------------------------Get Text Element------------------------------------------------------------------
    private getTextElement(parentId: string): Element {
        const element = this.searchElement(this.parentElement, parentId) as Element;
        const parentElement = this.range.startContainer.parentElement;
        let index = 0;

        if (parentElement) {
            for (let i = 0; i < parentElement.childNodes.length; i++) {
                if (parentElement.childNodes[i] == this.range.startContainer) {
                    index = i;
                    break;
                }
            }
        }

        return element.children[index];
    }



    // ---------------------------------------------------------Create Element------------------------------------------------------------------
    private createElement(data: TextData, parent: Element) {
        let element!: Element;

        // Div
        if (data.nodeType == NodeType.Div) {
            element = new DivElement();
        }

        // Span
        else if (data.nodeType == NodeType.Span) {
            element = new SpanElement();
        }

        // Text
        else if (data.nodeType == NodeType.Text) {
            const textElement = new TextElement(data.text as string);

            element = textElement;
        }

        // Break
        else if (data.nodeType == NodeType.Br) {
            element = new BreakElement();
        }

        // Unordered List
        else if (data.nodeType == NodeType.Ul) {
            element = new UnorderedListElement();
        }


        // Ordered List
        else if (data.nodeType == NodeType.Ol) {
            element = new OrderedListElement();
        }

        // List Item
        else if (data.nodeType == NodeType.Li) {
            element = new ListItemElement();
        }

        // Anchor
        else if (data.nodeType == NodeType.A) {
            element = new AnchorElement(data.link as string);
        }



        element.parent = parent;
        if (data.styles) element.styles = data.styles;

        if (data.children) {
            data.children.forEach((childData: TextData) => {
                element.children.push(this.createElement(childData, element));
            });
        }

        return element;
    }
}