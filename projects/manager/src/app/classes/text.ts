import { NodeType, Style, TextData } from "widgets";
import { AnchorElement } from "./anchor-element";
import { BreakElement } from "./break-element";
import { DivElement } from "./div-element";
import { Element } from "./element";
import { SelectedElementOnDeletion } from "./enums";
import { ListItemElement } from "./list-item-element";
import { OrderedListElement } from "./ordered-list-element";
import { SelectedElement } from "./selected-element";
import { SpanElement } from "./span-element";
import { TextElement } from "./text-element";
import { UnorderedListElement } from "./unordered-list-element";

export class Text {
    private rootParent!: Element;
    private root: DivElement = new DivElement(this.rootParent);
    private range!: Range;
    private startElement!: Element;
    private endElement!: Element;

    constructor(textData: Array<TextData>, private htmlElement: HTMLElement) {
        this.root.isRoot = true;

        textData.forEach((data: TextData) => {
            this.root.children.push(this.createElement(data, this.root));
        });
    }


    // ---------------------------------------------------------Render------------------------------------------------------------------
    public render(): void {
        if (this.root.children.length > 0) {
            while (this.htmlElement.firstChild) {
                this.htmlElement.removeChild(this.htmlElement.firstChild);
            }
        }

        this.htmlElement.id = this.root.id;

        this.root.children.forEach((element: Element) => {
            this.createHtml(element, this.htmlElement);
        });
    }





    // ---------------------------------------------------------On Paste------------------------------------------------------------------
    public onPaste(event: ClipboardEvent): void {
        // event.preventDefault();
    }




    // ---------------------------------------------------------On Mousedown------------------------------------------------------------------
    public onMousedown(): void {
        const onMouseup = () => {
            this.setSelection();
        }

        window.addEventListener('mouseup', onMouseup, { once: true });
    }






    // ---------------------------------------------------------On Keyup------------------------------------------------------------------
    public onKeyup(event: KeyboardEvent): void {
        if (event.key.includes('Arrow') || (event.ctrlKey && (event.key == 'a' || event.key == 'A'))) {
            this.setSelection();
        }
    }








    // ---------------------------------------------------------On Keydown------------------------------------------------------------------
    public onKeydown(event: KeyboardEvent): void {
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

        } else {
            if (this.startElement == this.endElement) {
                const textElement = this.startElement as TextElement;

                // Set the text
                textElement.text = textElement.text.substring(0, this.range.startOffset) + textElement.text.substring(this.range.endOffset);
                selectedElement = this.setKey(key, textElement, this.range.startOffset);

                // If we have no text
                if (textElement.text.length == 0) {
                    const container = textElement.container;
                    const firstChild = container.firstChild;

                    // Delete the text element
                    const element = textElement.parent.deleteChild(textElement, {
                        preserveContainer: true,
                        selectedChildOnDeletion: textElement == firstChild ? SelectedElementOnDeletion.Next : SelectedElementOnDeletion.Previous
                    });

                    selectedElement = element ? element.setSelectedElement(textElement == firstChild ? 0 : Infinity) : textElement.setSelectedElement(0);



                    // If the container has no more children add a break element
                    if (container.children.length == 0) {
                        const breakElement = new BreakElement(container);

                        container.children.push(breakElement);
                        selectedElement = container.setSelectedElement(0);
                    }
                }

            } else {
                selectedElement = this.onRangeKeydown(key, this.startElement, this.startElement.container);
            }
        }

        this.render();

        let node = document.getElementById(selectedElement.id) as Node;
        if (selectedElement.childIndex != -1) node = node.childNodes[selectedElement.childIndex] as Node;
        this.range.setStart(node, selectedElement.offset);
        this.setSelection();
    }







    // ---------------------------------------------------------Create Html------------------------------------------------------------------
    private createHtml(element: Element, parent: HTMLElement): void {
        element.createHtml(parent);
    }



    // ---------------------------------------------------------Set Selection------------------------------------------------------------------
    private setSelection(): void {
        const selection = window.getSelection();

        if (selection) this.range = selection.getRangeAt(0);

        if (this.range.collapsed) {
            this.startElement = this.endElement = this.getElement(this.range.startContainer);
        } else {
            const startNode = this.getChildNode(this.range.startContainer);
            this.range.setStart(startNode, this.range.startOffset);

            const endNode = this.getChildNode(this.range.endContainer);
            this.range.setEnd(endNode, this.range.endOffset);

            this.startElement = this.getElement(this.range.startContainer);
            this.endElement = this.getElement(this.range.endContainer);
        }
    }


    // ---------------------------------------------------------Get Child Node------------------------------------------------------------------
    private getChildNode(node: Node): Node {
        if (node.nodeName == '#text' || node.nodeName == 'BR') return node;

        return this.getChildNode(node.firstChild as Node);
    }













    // ---------------------------------------------------------Set Key------------------------------------------------------------------
    private setKey(key: string, element: Element, offset: number): SelectedElement {
        if (key == 'Enter') return element.onEnter(offset);
        if (key == 'Backspace' || key == 'Delete') return element.setSelectedElement(offset);

        return element.onKeydown(key, offset);
    }








    public applyStyle(style: Style) {
        const textElement = this.startElement as TextElement;
        if (this.range.startOffset == 0 && this.range.endOffset < textElement.text.length) {
            textElement.styleBeginningText(style, this.range.endOffset);
        } else if (this.range.startOffset > 0 && this.range.endOffset < textElement.text.length) {
            textElement.styleMiddleText(style, this.range.startOffset, this.range.endOffset);
        } else if (this.range.startOffset > 0 && this.range.endOffset == textElement.text.length) {
            textElement.styleEndText(style, this.range.startOffset);
        } else if (this.range.startOffset == 0 && this.range.endOffset == textElement.text.length) {
            textElement.styleWholeText(style);
        }

        this.render();
    }




    // ---------------------------------------------------------On Range Keydown------------------------------------------------------------------
    private onRangeKeydown(key: string, currentElement: Element, startContainer: Element): SelectedElement {
        // Start element
        if (currentElement.id == this.startElement.id) {
            if (currentElement != startContainer.firstChild || this.range.startOffset > 0) {


                // Trim the end of the text
                if (this.range.startOffset > 0) {
                    const textElement = currentElement as TextElement;
                    textElement.text = textElement.text.substring(0, this.range.startOffset);

                    const nextChild = textElement.nextChild;

                    if (nextChild) return this.onRangeKeydown(key, nextChild, startContainer);
                }
            }



            // End Element
        } else if (currentElement.id == this.endElement.id) {
            const currentContainer = currentElement.container;

            // If element is a text element
            if (this.range.endContainer.nodeType == 3) {


                // If the offset is not to the end of the text
                if (startContainer != currentContainer && (currentElement != currentContainer.lastChild ||
                    this.range.endOffset != this.range.endContainer.textContent?.length)) {

                    // This will copy the elements from the current container and place them into the start container
                    currentContainer.children.forEach((child: Element) => {
                        const copiedElement = child.copyElement(startContainer);

                        if (copiedElement) {
                            startContainer?.children.push(copiedElement);
                        }
                    });


                    const newElement = this.searchElement(startContainer, currentElement.id);
                    if (newElement) currentElement = newElement;

                    // Delete the current container
                    currentContainer.parent.deleteChild(currentContainer);
                }


                // Set the text if selection is NOT at the end of the text
                if (this.range.endContainer.textContent?.length != this.range.endOffset) {
                    const textElement = currentElement as TextElement;

                    textElement.text = textElement.text.substring(this.range.endOffset);

                    // Get the previous child
                    const previousChild = textElement.previousChild;
                    const startContainerHasPreviousChild = previousChild && previousChild.container == startContainer;

                    if (previousChild && startContainerHasPreviousChild) {
                        return this.setKey(key, previousChild, Infinity);
                    } else {
                        return this.setKey(key, textElement, 0);
                    }
                }
            }


            // This is used to determine what the selected element will be
            const previousChild = currentElement.previousChild;
            const hasPreviousChild = previousChild && previousChild.container == startContainer;
            const selectedElement = currentElement.parent.deleteChild(currentElement, {
                selectedChildOnDeletion: hasPreviousChild ? SelectedElementOnDeletion.Previous : SelectedElementOnDeletion.Next,
                preserveContainer: currentContainer == startContainer
            });


            // If the start container has no children, create a break element inside the start container
            if (startContainer.children.length == 0) {
                startContainer.children.push(new BreakElement(startContainer));
                return this.setKey(key, startContainer, 0);
            }

            if (selectedElement) return this.setKey(key, selectedElement, hasPreviousChild ? Infinity : 0);
        }


        // Delete the current element
        const firstChild = currentElement.firstChild;
        let nextChild!: Element;
        const element = firstChild.parent.deleteChild(firstChild, {
            selectedChildOnDeletion: SelectedElementOnDeletion.Next,
            preserveContainer: currentElement.container == startContainer
        });

        if (element) nextChild = element;

        return this.onRangeKeydown(key, nextChild, startContainer);
    }








    // ---------------------------------------------------------Get Key------------------------------------------------------------------
    private getKey(event: KeyboardEvent): string | null {
        if (event.key == 'Backspace' || event.key == 'Enter' || event.key == 'Delete' || event.key == 'Tab') return event.key;

        if (!/^(?:\w|\W){1}$/.test(event.key) || event.ctrlKey) return null;

        return event.key;
    }








    // ---------------------------------------------------------Get Element------------------------------------------------------------------
    private getElement(node: Node): Element {
        if (node.nodeType == 3) {
            return this.getTextElement(node);
        }

        return this.searchElement(this.root, (node as HTMLElement).id) as Element;
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
    private getTextElement(node: Node): Element {
        const parentId = node.parentElement?.id as string
        const element = this.searchElement(this.root, parentId) as Element;
        const parentElement = node.parentElement;
        let index = 0;

        if (parentElement) {
            for (let i = 0; i < parentElement.childNodes.length; i++) {
                if (parentElement.childNodes[i] == node) {
                    index = i;
                    break;
                }
            }
        }

        return element.children[index];
    }



    // ---------------------------------------------------------Create Element------------------------------------------------------------------
    private createElement(data: TextData, parent: Element): Element {
        let element!: Element;

        // Div
        if (data.nodeType == NodeType.Div) {
            element = new DivElement(parent);
        }

        // Span
        else if (data.nodeType == NodeType.Span) {
            element = new SpanElement(parent);
        }

        // Text
        else if (data.nodeType == NodeType.Text) {
            const textElement = new TextElement(parent, data.text as string);

            element = textElement;
        }

        // Break
        else if (data.nodeType == NodeType.Br) {
            element = new BreakElement(parent);
        }

        // Unordered List
        else if (data.nodeType == NodeType.Ul) {
            element = new UnorderedListElement(parent);
        }


        // Ordered List
        else if (data.nodeType == NodeType.Ol) {
            element = new OrderedListElement(parent);
        }

        // List Item
        else if (data.nodeType == NodeType.Li) {
            element = new ListItemElement(parent);
        }

        // Anchor
        else if (data.nodeType == NodeType.A) {
            element = new AnchorElement(parent, data.link as string);
        }

        // Set the styles
        if (data.styles) element.styles = data.styles;

        // Create the children
        if (data.children) {
            data.children.forEach((childData: TextData) => {
                element.children.push(this.createElement(childData, element));
            });
        }

        return element;
    }
}