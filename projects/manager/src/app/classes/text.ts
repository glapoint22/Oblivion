import { NodeType, TextData } from "widgets";
import { AnchorElement } from "./anchor-element";
import { BreakElement } from "./break-element";
import { DivElement } from "./div-element";
import { Element } from "./element";
import { SelectedElementOnDeletion } from "./enums";
import { ListItemElement } from "./list-item-element";
import { OrderedListElement } from "./ordered-list-element";
import { SpanElement } from "./span-element";
import { TextElement } from "./text-element";
import { TextSelection } from "./text-selection";
import { UnorderedListElement } from "./unordered-list-element";

export class Text {
    public range!: Range;
    public startElement!: Element;
    public endElement!: Element;
    public root!: DivElement;

    constructor(private htmlElement: HTMLElement) {
        let rootParent!: Element;
        this.root = new DivElement(rootParent);
        this.root.isRoot = true;

        const divElement = new DivElement(this.root);
        const breakElement = new BreakElement(divElement);

        divElement.children.push(breakElement);
        this.root.children.push(divElement);

        this.render();

        htmlElement.focus();
        this.getSelection();
        this.setRange();


        // Mousedown
        htmlElement.addEventListener('mousedown', () => {
            const onMouseup = () => {
                this.getSelection();
                this.setRange();
            }

            window.addEventListener('mouseup', onMouseup, { once: true });
        });

        // Paste
        htmlElement.addEventListener('paste', (event: ClipboardEvent) => {
            event.preventDefault();
        });


        // Keydown
        htmlElement.addEventListener('keydown', this.onKeydown);


        // Keyup
        htmlElement.addEventListener('keyup', (event: KeyboardEvent) => {
            if (event.key.includes('Arrow') || (event.ctrlKey && (event.key == 'a' || event.key == 'A'))) {
                this.getSelection();
                this.setRange();
            }
        });
    }



    // ---------------------------------------------------------Load------------------------------------------------------------------
    public load(textData: Array<TextData>) {
        this.root.children = [];

        textData.forEach((data: TextData) => {
            this.root.children.push(this.createElement(data, this.root));
        });

        this.render();

        const textSelection = this.root.children[0].firstChild.setSelectedElement(0);
        let node = document.getElementById(textSelection.id) as Node;
        if (textSelection.childIndex != -1) node = node.childNodes[textSelection.childIndex] as Node;
        this.range.setStart(node, textSelection.offset);
        this.setRange();
    }





    concatenate(element: Element = this.root) {
        for (let i = 0; i < element.children.length; i++) {
            if (i != element.children.length - 1) {

                // Span
                if (element.children[i].nodeType == NodeType.Span &&
                    element.children[i + 1].nodeType == NodeType.Span &&
                    element.children[i].styles.every(x => element.children[i + 1].styles.map(x => x.style).includes(x.style) &&
                        element.children[i + 1].styles.map(x => x.value).includes(x.value))) {


                    element.children[i + 1].children.forEach((child: Element) => {
                        const copiedElement = child.copyElement(element.children[i]);

                        if (copiedElement) {
                            element.children[i].children.push(copiedElement);
                        }

                        element.children[i + 1].parent.deleteChild(element.children[i + 1]);
                    });

                    i--;
                    continue;
                }


                // Text
                if (element.children[i].nodeType == NodeType.Text && element.children[i + 1].nodeType == NodeType.Text) {
                    (element.children[i] as TextElement).text += (element.children[i + 1] as TextElement).text;
                    element.children[i + 1].parent.deleteChild(element.children[i + 1]);

                    i--;
                    continue;
                }
            }

            this.concatenate(element.children[i]);
        }
    }


    // ---------------------------------------------------------On Range Keydown------------------------------------------------------------------
    private onRangeKeydown(key: string, currentElement: Element, startContainer: Element): TextSelection {
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




    // ---------------------------------------------------------Set Key------------------------------------------------------------------
    private setKey(key: string, element: Element, offset: number): TextSelection {
        if (key == 'Enter') return element.onEnter(offset);
        if (!this.range.collapsed && (key == 'Backspace' || key == 'Delete')) return element.setSelectedElement(offset);
        if (key == 'Backspace') return element.onBackspace(offset);
        if (key == 'Delete') return element.onDelete(offset);

        return element.onKeydown(key, offset);
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




    // ---------------------------------------------------------Create Html------------------------------------------------------------------
    private createHtml(element: Element, parent: HTMLElement): void {
        element.createHtml(parent);
    }






    // ---------------------------------------------------------Get Element------------------------------------------------------------------
    public getElement(node: Node): Element {
        if (node.nodeType == 3) {
            return this.getTextElement(node);
        }

        return this.searchElement(this.root, (node as HTMLElement).id) as Element;
    }







    // ---------------------------------------------------------Search Element------------------------------------------------------------------
    public searchElement(parentElement: Element, id: string): Element | null {
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




    // ---------------------------------------------------------On Keydown------------------------------------------------------------------
    private onKeydown = (event: KeyboardEvent) => {
        const key = this.getKey(event);

        if (!key) return;
        event.preventDefault();

        let textSelection!: TextSelection;

        if (this.range.collapsed) {
            textSelection = this.setKey(key, this.startElement, this.range.startOffset);
        } else {
            if (this.startElement == this.endElement) {
                const textElement = this.startElement as TextElement;

                // Set the text
                textElement.text = textElement.text.substring(0, this.range.startOffset) + textElement.text.substring(this.range.endOffset);
                textSelection = this.setKey(key, textElement, this.range.startOffset);

                // If we have no text
                if (textElement.text.length == 0) {
                    const container = textElement.container;
                    const firstChild = container.firstChild;

                    // Delete the text element
                    const element = textElement.parent.deleteChild(textElement, {
                        preserveContainer: true,
                        selectedChildOnDeletion: textElement == firstChild ? SelectedElementOnDeletion.Next : SelectedElementOnDeletion.Previous
                    });

                    // If the container has no more children add a break element
                    if (container.children.length == 0) {
                        const breakElement = new BreakElement(container);

                        container.children.push(breakElement);
                        textSelection = container.setSelectedElement(0);
                    } else {
                        textSelection = element ? element.setSelectedElement(textElement == firstChild ? 0 : Infinity) : textElement.setSelectedElement(0);
                    }
                }
            } else {
                textSelection = this.onRangeKeydown(key, this.startElement, this.startElement.container);
            }
        }

        this.concatenate();

        this.render();

        let node = document.getElementById(textSelection.id) as Node;
        if (textSelection.childIndex != -1) node = node.childNodes[textSelection.childIndex] as Node;
        this.range.setStart(node, textSelection.offset);
        this.setRange();
    }

    getSelection() {
        const selection = window.getSelection();

        if (selection) this.range = selection.getRangeAt(0);
    }

    setRange() {
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



    trumpy() {
        this.concatenate();

        const startSelection = this.startElement.setSelectedElement(0);
        const endSelection = this.endElement.setSelectedElement((this.endElement as TextElement).text.length);

        this.render();


        let node = document.getElementById(startSelection.id) as Node;
        if (startSelection.childIndex != -1) node = node.childNodes[startSelection.childIndex] as Node;
        this.range.setStart(node, 0);


        node = document.getElementById(endSelection.id) as Node;
        if (endSelection.childIndex != -1) node = node.childNodes[endSelection.childIndex] as Node;
        this.range.setEnd(node, endSelection.offset);

        this.htmlElement.focus();
    }


    // ---------------------------------------------------------Get Child Node------------------------------------------------------------------
    private getChildNode(node: Node): Node {
        if (node.nodeName == '#text' || node.nodeName == 'BR') return node;

        return this.getChildNode(node.firstChild as Node);
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