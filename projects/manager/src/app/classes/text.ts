import { NodeType, TextData } from "widgets";
import { AnchorElement } from "./anchor-element";
import { BreakElement } from "./break-element";
import { DivElement } from "./div-element";
import { Element } from "./element";
import { Selection } from "./selection";
import { SelectedElementOnDeletion } from "./enums";
import { ListItemElement } from "./list-item-element";
import { OrderedListElement } from "./ordered-list-element";
import { SpanElement } from "./span-element";
import { TextElement } from "./text-element";
import { UnorderedListElement } from "./unordered-list-element";
import { Subject } from "rxjs";

export class Text {
    public selection: Selection;
    public root!: DivElement;
    public onSelection: Subject<void> = new Subject<void>();


    constructor(private htmlElement: HTMLElement) {
        // Set the root
        let rootParent!: Element;
        this.root = new DivElement(rootParent);
        this.root.isRoot = true;
        this.selection = new Selection(this.root);

        // Create the first child
        const divElement = new DivElement(this.root);
        const breakElement = new BreakElement(divElement);
        divElement.children.push(breakElement);

        // Add the first child
        this.root.children.push(divElement);

        // Give focus to the html element
        this.setFocus();

        // Render the text and set the selection
        this.render();
        this.selection.setSelection();



        // Mousedown
        htmlElement.addEventListener('mousedown', () => {
            const onMouseup = () => {
                window.setTimeout(() => {
                    this.selection.setSelection();
                    this.onSelection.next();
                });

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
                window.setTimeout(() => {
                    this.selection.setSelection();
                    this.onSelection.next();
                });
            }
        });
    }




    // ---------------------------------------------------------Set Focus------------------------------------------------------------------
    public setFocus() {
        this.htmlElement.focus();
    }






    // ---------------------------------------------------------Load------------------------------------------------------------------
    public load(textData: Array<TextData>) {
        this.root.children = [];

        textData.forEach((data: TextData) => {
            this.root.children.push(this.createElement(data, this.root));
        });

        const selection = this.root.children[0].firstChild.getStartSelection();
        this.selection.setStartSelection(selection);

        this.render();
        this.selection.setRange();
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





    // ---------------------------------------------------------Merge------------------------------------------------------------------
    public merge(element: Element = this.root): void {
        for (let i = 0; i < element.children.length; i++) {
            const currentElement = element.children[i];


            // Current element's styles are the same as its parent
            if (currentElement.styles.some(x => currentElement.parent.styles.map(z => z.style).includes(x.style) &&
                currentElement.parent.styles.map(z => z.value).includes(x.value))) {


                for (let j = 0; j < currentElement.styles.length; j++) {
                    const currentStyle = currentElement.styles[j];

                    if (currentElement.parent.styles.some(x => x.style == currentStyle.style && x.value == currentStyle.value)) {
                        currentElement.styles.splice(j, 1);
                        j--;
                    }
                }

                if (currentElement.styles.length == 0) {
                    const startIndex = currentElement.parent.children.findIndex(x => x == currentElement);
                    let index = startIndex;

                    currentElement.children.forEach((child: Element) => {
                        const copiedElement = child.copyElement(currentElement.parent);

                        if (copiedElement) {
                            currentElement.parent.children.splice(index, index == startIndex ? 1 : 0, copiedElement);
                            index++;
                        }
                    });

                    // Reset the selection
                    this.selection.resetSelection();
                }

                i = -1;
                continue;
            }







            if (i != element.children.length - 1) {

                const nextElement = element.children[i + 1];

                // Do the current and next element's node types match?
                if (((currentElement.nodeType == NodeType.Span && nextElement.nodeType == NodeType.Span) ||
                    (currentElement.nodeType == NodeType.A && nextElement.nodeType == NodeType.A))

                    // Do their styles match?
                    && currentElement.styles.every(x => nextElement.styles.map(z => z.style).includes(x.style) &&
                        nextElement.styles.map(z => z.value).includes(x.value)) &&
                    nextElement.styles.every(x => currentElement.styles.map(z => z.style).includes(x.style) &&
                        currentElement.styles.map(z => z.value).includes(x.value))) {

                    // Everyting matches, so copy the contents from the next element to the current element
                    nextElement.children.forEach((child: Element) => {
                        const copiedElement = child.copyElement(currentElement);

                        if (copiedElement) {
                            currentElement.children.push(copiedElement);
                        }
                    });

                    // Delete the next element
                    nextElement.parent.deleteChild(nextElement);

                    // Reset the selection
                    this.selection.resetSelection();

                    i--;
                    continue;
                }


                // Current element and next element are text
                if (currentElement.nodeType == NodeType.Text && nextElement.nodeType == NodeType.Text) {
                    const currentTextElement = currentElement as TextElement;
                    const nextTextElement = nextElement as TextElement;


                    // Next element is the selection start element
                    if (nextTextElement.id == this.selection.startElement.id) {
                        this.selection.startElement = currentTextElement;
                        this.selection.startOffset = currentTextElement.text.length;
                        this.selection.startChildIndex = currentTextElement.parent.children.findIndex(x => x == currentTextElement);
                    }


                    // Next element is the selection end element
                    if (nextTextElement.id == this.selection.endElement.id) {
                        this.selection.endElement = currentTextElement;
                        this.selection.endOffset = this.selection.collapsed ? this.selection.startOffset : currentTextElement.text.length + nextTextElement.text.length;
                        this.selection.endChildIndex = currentTextElement.parent.children.findIndex(x => x == currentTextElement);
                    }

                    // Merge the text
                    currentTextElement.text += nextTextElement.text;
                    nextTextElement.parent.deleteChild(nextTextElement);

                    i--;
                    continue;
                }




                // Current element and next element list types match
                if ((currentElement.nodeType == NodeType.Ul && nextElement.nodeType == NodeType.Ul) ||
                    (currentElement.nodeType == NodeType.Ol && nextElement.nodeType == NodeType.Ol)) {

                    nextElement.children.forEach((child: Element) => {
                        const copiedElement = child.copyElement(currentElement);

                        if (copiedElement) {
                            currentElement.children.push(copiedElement);
                        }
                    });

                    // Delete the next element
                    nextElement.parent.deleteChild(nextElement);

                    // Reset the selection
                    this.selection.resetSelection(this.root, this.selection.startOffset, this.selection.endOffset);

                    i--;
                    continue;
                }

            }

            this.merge(currentElement);
        }
    }



    // ---------------------------------------------------------On Keydown------------------------------------------------------------------
    private onKeydown = (event: KeyboardEvent) => {
        const key = this.getKey(event);

        if (!key) return;
        event.preventDefault();

        let selection!: Selection;

        if (this.selection.collapsed) {
            selection = this.setKey(key, this.selection.startElement, this.selection.startOffset);
        } else {
            if (this.selection.startElement == this.selection.endElement) {
                const textElement = this.selection.startElement as TextElement;

                // Set the text
                textElement.text = textElement.text.substring(0, this.selection.startOffset) + textElement.text.substring(this.selection.endOffset);
                selection = this.setKey(key, textElement, this.selection.startOffset);

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
                        selection = container.getStartSelection();
                    } else {
                        selection = element ? element.getStartSelection(textElement == firstChild ? 0 : Infinity) : textElement.getStartSelection();
                    }
                }
            } else {
                const startContainer = this.selection.startElement.nodeType == NodeType.Div || this.selection.startElement.nodeType == NodeType.Li ?
                    this.selection.startElement : this.selection.startElement.container;
                selection = this.onRangeKeydown(key, this.selection.startElement, startContainer);
            }
        }

        this.selection.setStartSelection(selection);
        this.merge();
        this.render();
        this.selection.setRange();
    }





    // ---------------------------------------------------------On Range Keydown------------------------------------------------------------------
    private onRangeKeydown(key: string, currentElement: Element, startContainer: Element): Selection {
        let selection!: Selection;

        while (!selection) {
            // Start element
            if (currentElement.id == this.selection.startElement.id) {
                if (currentElement != startContainer.firstChild || this.selection.startOffset > 0) {


                    // Trim the end of the text
                    if (this.selection.startOffset > 0) {
                        const textElement = currentElement as TextElement;
                        textElement.text = textElement.text.substring(0, this.selection.startOffset);

                        const nextChild = textElement.nextChild;

                        if (nextChild) currentElement = nextChild;
                        continue;
                    }
                }



                // End Element
            } else if (currentElement.id == this.selection.endElement.id || currentElement.id == this.selection.endElement.firstChild.id) {
                const currentContainer = currentElement.container;

                // If element is a text element
                if (this.selection.endElement.nodeType == NodeType.Text) {


                    // If the offset is not at the end of the text
                    if (startContainer != currentContainer && (currentElement != currentContainer.lastChild ||
                        this.selection.endOffset != (this.selection.endElement as TextElement).text.length)) {

                        // This will copy the elements from the current container and place them into the start container
                        currentContainer.children.forEach((child: Element) => {
                            const copiedElement = child.copyElement(startContainer);

                            if (copiedElement) {
                                startContainer.children.push(copiedElement);
                            }
                        });


                        const newElement = Element.search(currentElement.id, startContainer);
                        if (newElement) currentElement = newElement;

                        // Delete the current container
                        currentContainer.parent.deleteChild(currentContainer);
                    }


                    // Set the text if selection is NOT at the end of the text
                    if ((this.selection.endElement as TextElement).text.length != this.selection.endOffset) {
                        const textElement = currentElement as TextElement;

                        textElement.text = textElement.text.substring(this.selection.endOffset);

                        // Get the previous child
                        const previousChild = textElement.previousChild;
                        const startContainerHasPreviousChild = previousChild && previousChild.container == startContainer;

                        if (previousChild && startContainerHasPreviousChild) {
                            selection = this.setKey(key, previousChild, Infinity);
                        } else {
                            selection = this.setKey(key, textElement, 0);
                        }

                        continue;
                    }
                }


                else {

                    // This will copy the elements from the current container and place them into the start container
                    currentContainer.children.forEach((child: Element) => {
                        const copiedElement = child.copyElement(startContainer);

                        if (copiedElement) {
                            startContainer.children.push(copiedElement);
                        }
                    });


                    const newElement = Element.search(currentElement.id, startContainer);
                    if (newElement) currentElement = newElement;

                    // Delete the current container
                    currentContainer.parent.deleteChild(currentContainer);


                    // Get the previous child
                    const previousChild = currentElement.previousChild;
                    const startContainerHasPreviousChild = previousChild && previousChild.container == startContainer;

                    if (previousChild && startContainerHasPreviousChild) {
                        // If the current element is a break element
                        if (currentElement.nodeType == NodeType.Br) {
                            currentElement.parent.deleteChild(currentElement);
                        }

                        selection = this.setKey(key, previousChild, Infinity);
                    } else {
                        selection = this.setKey(key, currentElement, 0);
                    }

                    continue;
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
                    selection = this.setKey(key, startContainer, 0);
                    continue;
                }

                if (selectedElement) selection = this.setKey(key, selectedElement, hasPreviousChild ? Infinity : 0);
                continue;
            }


            // Delete the current element
            const firstChild = currentElement.firstChild;
            const nextElement = firstChild.parent.deleteChild(firstChild, {
                selectedChildOnDeletion: SelectedElementOnDeletion.Next,
                preserveContainer: currentElement.container == startContainer || currentElement == startContainer
            });

            if (nextElement) currentElement = nextElement;
        }

        return selection;
    }















    // ---------------------------------------------------------Get Key------------------------------------------------------------------
    private getKey(event: KeyboardEvent): string | null {
        if (event.key == 'Backspace' || event.key == 'Enter' || event.key == 'Delete') return event.key;

        if (!/^(?:\w|\W){1}$/.test(event.key) || event.ctrlKey) return null;

        return event.key;
    }








    // ---------------------------------------------------------Set Key------------------------------------------------------------------
    private setKey(key: string, element: Element, offset: number): Selection {
        // Enter
        if (key == 'Enter') return element.onEnter(offset);

        // Backspace
        if (key == 'Backspace') {
            if (this.selection.collapsed) return element.onBackspace(offset);
            return element.getStartSelection(offset);
        }

        // Delete
        if (key == 'Delete') {
            if (this.selection.collapsed) return element.onDelete(offset);
            return element.getStartSelection(offset);
        }

        // Other
        return element.onKeydown(key, offset);
    }










    // ---------------------------------------------------------Create Html------------------------------------------------------------------
    private createHtml(element: Element, parent: HTMLElement): void {
        element.createHtml(parent);
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

        // indent
        if (data.indent) element.indent = data.indent;

        // Create the children
        if (data.children) {
            data.children.forEach((childData: TextData) => {
                element.children.push(this.createElement(childData, element));
            });
        }

        return element;
    }
}