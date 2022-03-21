import { NodeType, TextData } from "widgets";
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
    public render() {
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
    private createHtml(element: Element, parent: HTMLElement) {
        element.createHtml(parent);
    }



    // ---------------------------------------------------------Set Selection------------------------------------------------------------------
    setSelection() {
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
    getChildNode(node: Node): Node {
        if (node.nodeName == '#text' || node.nodeName == 'BR') return node;

        return this.getChildNode(node.firstChild as Node);
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

        } else {
            if (this.startElement == this.endElement) {
                const textElement = this.startElement as TextElement;

                textElement.text = textElement.text.substring(0, this.range.startOffset) + textElement.text.substring(this.range.endOffset);

                if (textElement.text.length > 0) {
                    selectedElement = this.startElement.setSelectedElement(this.range.startOffset);
                } else {
                    const container = this.startElement.getContainer();
                    this.startElement.parent.deleteChild(this.startElement, { preserveContainer: true });

                    container.children.push(new BreakElement(container));
                    selectedElement = container.setSelectedElement(0);
                }

            } else {
                selectedElement = this.deleteRange(this.startElement, this.startElement.getContainer());
            }
        }

        this.render();

        let node = document.getElementById(selectedElement.id) as Node;
        if (selectedElement.childIndex != -1) node = node.childNodes[selectedElement.childIndex] as Node;
        this.range.setStart(node, selectedElement.offset);
        this.setSelection();
    }









    deleteRange(element: Element, startContainer: Element): SelectedElement {
        let nextChild!: Element;

        // Start element
        if (element.id == this.startElement.id) {
            if (element != startContainer.getFirstChild() || this.range.startOffset > 0) {


                // Trim the end of the text
                if (this.range.startOffset > 0) {
                    const textElement = element as TextElement;
                    textElement.text = textElement.text.substring(0, this.range.startOffset);

                    nextChild = element.getNextChild().getFirstChild();
                    return this.deleteRange(nextChild, startContainer);
                }
            }



            // End Element
        } else if (element.id == this.endElement.id) {
            let selectedElement!: Element;
            const currentContainer = element.getContainer();

            // If element is a text element
            if (this.range.endContainer.nodeType == 3) {


                // If the offset is not to the end of the text
                if (startContainer != currentContainer && (element != currentContainer.getLastChild() ||
                    this.range.endOffset != this.range.endContainer.textContent?.length)) {

                    // This will copy the elements from the current container and place them into the start container
                    currentContainer.children.forEach((child: Element) => {
                        const copiedElement = child.copyElement(startContainer);

                        if (copiedElement) {
                            startContainer?.children.push(copiedElement);
                        }
                    });


                    const newElement = this.searchElement(startContainer, element.id);
                    if (newElement) element = newElement;

                    // Delete the current container
                    currentContainer.parent.deleteChild(currentContainer);
                }


                // Trim the begining of the text
                if (this.range.endContainer.textContent?.length != this.range.endOffset) {
                    const textElement = element as TextElement;

                    textElement.text = textElement.text.substring(this.range.endOffset);
                    return textElement.setSelectedElement(0);
                }
            }


            // This is used to determine what the selected element will be
            const isLastChild = element == currentContainer.getLastChild() && this.range.endOffset == this.range.endContainer.textContent?.length;

            selectedElement = element.parent.deleteChild(element, {
                selectedChildOnDeletion: isLastChild ? SelectedElementOnDeletion.Previous : SelectedElementOnDeletion.Next,
                preserveContainer: currentContainer == startContainer
            });


            // If the start container has no children, create a break element inside the start container
            if (startContainer.children.length == 0) {
                startContainer.children.push(new BreakElement(startContainer));
                return startContainer.setSelectedElement(0);
            }

            return selectedElement.setSelectedElement(isLastChild ? Infinity : 0);
        }


        // Delete the current element
        const firstChild = element.getFirstChild();
        nextChild = firstChild.parent.deleteChild(firstChild, {
            selectedChildOnDeletion: SelectedElementOnDeletion.Next,
            preserveContainer: element.getContainer() == startContainer
        });

        return this.deleteRange(nextChild, startContainer);
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
    private createElement(data: TextData, parent: Element) {
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