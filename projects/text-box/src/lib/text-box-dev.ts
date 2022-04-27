import { Subject } from "rxjs";
import { BreakElement } from "./break-element";
import { DivElement } from "./div-element";
import { Element } from "./element";
import { ElementDeleteStatus } from "./element-delete-status";
import { ElementRange } from "./element-range";
import { Selection } from "./selection";
import { TextBox } from "./text-box";
import { TextElement } from "./text-element";

export class TextBoxDev extends TextBox {
    public selection = new Selection();
    public onSelection: Subject<void> = new Subject<void>();

    constructor(htmlRootElement: HTMLElement) {
        super(htmlRootElement);

        // Create the first child
        const divElement = new DivElement(this.rootElement);
        const breakElement = new BreakElement(divElement);
        divElement.children.push(breakElement);

        // Add the first child
        this.rootElement.children.push(divElement);



        // Mousedown
        htmlRootElement.addEventListener('mousedown', () => {
            const onMouseup = () => {
                window.setTimeout(() => {
                    this.selection.onSelection(this.rootElement);
                    this.onSelection.next();
                });
            }

            window.addEventListener('mouseup', onMouseup, { once: true });
        });



        // Paste
        htmlRootElement.addEventListener('paste', (event: ClipboardEvent) => {
            event.preventDefault();

            const clipboardData = event.clipboardData?.getData('text/plain');

            if (clipboardData) {
                if (!this.selection.collapsed) this.deleteRange();

                this.selection.startElement.onTextInput(clipboardData, this.selection.startOffset);
                this.render();
            }
        });



        // Keydown
        htmlRootElement.addEventListener('keydown', (event) => {
            const key = this.getKey(event);
            if (!key) return;

            event.preventDefault();

            // We have a ranged selection
            if (!this.selection.collapsed) {
                this.deleteRange();

                if (key == 'Enter') {
                    // On Enter Keydown
                    this.selection.startElement.onEnterKeydown(this.selection.startOffset);
                } else if (key != 'Backspace' && key != 'Delete') {
                    // On Text Input
                    this.selection.startElement.onTextInput(key, this.selection.startOffset);
                }

                // Ranged is collapsed
            } else {
                if (key == 'Backspace') {
                    // On Backspace keydown
                    this.selection.startElement.onBackspaceKeydown(this.selection.startOffset);
                } else if (key == 'Enter') {
                    // On Enter keydown
                    this.selection.startElement.onEnterKeydown(this.selection.startOffset);
                } else if (key == 'Delete') {
                    // On Delete keydown
                    this.selection.startElement.onDeleteKeydown(this.selection.startOffset);
                } else {
                    // On Text input
                    this.selection.startElement.onTextInput(key, this.selection.startOffset);
                }
            }

            this.render();
        });


        // Keyup
        htmlRootElement.addEventListener('keyup', (event: KeyboardEvent) => {
            if (event.key.includes('Arrow') || (event.ctrlKey && (event.key == 'a' || event.key == 'A'))) {
                window.setTimeout(() => {
                    this.selection.onSelection(this.rootElement);
                    this.onSelection.next();
                });
            }
        });
    }



    // ---------------------------------------------------------Render------------------------------------------------------------------
    public render(): void {
        // Assign the root id
        this.htmlRootElement.id = this.rootElement.id;

        super.render();
    }




    // ---------------------------------------------------------Generate Html------------------------------------------------------------------
    protected generateHtml() {
        // Generate the html for each element
        this.rootElement.children.forEach((element: Element) => {
            element.generateHtml(this.htmlRootElement, true);
        });
    }


    // ---------------------------------------------------------Delete Range------------------------------------------------------------------
    private deleteRange(currentElement: Element = this.selection.commonAncestorContainer, range: ElementRange = new ElementRange(), startContainer: Element = this.selection.startElement.container): ElementDeleteStatus {
        let status!: ElementDeleteStatus;

        // If current element is the start element
        if (currentElement.id == this.selection.startElement.id) {
            startContainer.preserve = true;

            // Selection only contains one text element
            if (this.selection.startElement == this.selection.endElement) {
                const textElement = this.selection.startElement as TextElement;
                const startText = textElement.text.substring(0, this.selection.startOffset);
                const endText = textElement.text.substring(this.selection.endOffset);

                // Set the new text
                textElement.text = startText + endText;

                // If we have an empty text
                if (textElement.text.length == 0) {
                    textElement.delete();

                    // Insert a break element
                    if (startContainer.children.length == 0) {
                        startContainer.children.push(new BreakElement(startContainer));
                    }
                }

                return ElementDeleteStatus.DeletionComplete;
            }


            status = currentElement.delete(0, this.selection.startOffset);
            range.inRange = true;
            return status;
        }

        // If current element is the end element
        else if (currentElement.id == this.selection.endElement.id) {
            const endContainer = currentElement.container;

            status = currentElement.delete(this.selection.endOffset);

            // If the start container is empty and we have nothing moving into it, insert a break element
            if ((startContainer == endContainer && startContainer.children.length == 0) ||
                (endContainer.children.length == 0 && startContainer.children.length == 0)) {

                // Insert a break element
                startContainer.children.push(new BreakElement(startContainer));


                // Move the elements into the start container
            } else if (startContainer != endContainer && endContainer.children.length > 0) {
                if (status == ElementDeleteStatus.Deleted) currentElement = endContainer;
                currentElement.moveTo(startContainer);
            }

            return ElementDeleteStatus.DeletionComplete;
        }

        // Other
        else if (range.inRange) {
            if (!Element.search(this.selection.endElement.id, currentElement)) {
                return currentElement.delete();
            }
        }


        // Loop through each child
        for (let i = 0; i < currentElement.children.length; i++) {
            const child = currentElement.children[i];

            status = this.deleteRange(child, range, startContainer);

            // If complete, we are done!
            if (status == ElementDeleteStatus.DeletionComplete) return status;

            // If current element has been deleted
            if (status == ElementDeleteStatus.Deleted) {

                // If we are on the last child, return not deleted
                if (i == currentElement.children.length && currentElement.children.length != 0) {
                    return ElementDeleteStatus.NotDeleted;
                }

                // This will ensure we loop through all children
                i--;
            }
        }

        return status;
    }




    // ---------------------------------------------------------Get Key------------------------------------------------------------------
    private getKey(event: KeyboardEvent): string | null {
        if (event.key == 'Backspace' || event.key == 'Enter' || event.key == 'Delete') return event.key;

        if (!/^(?:\w|\W){1}$/.test(event.key) || event.ctrlKey) return null;

        return event.key;
    }
}