import { Subject } from "rxjs";
import { BreakElement } from "./break-element";
import { DivElement } from "./div-element";
import { Element } from "./element";
import { ElementRange } from "./element-range";
import { Selection } from "./selection";
import { TextBox } from "./text-box";

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

            // if (clipboardData) this.onInput(clipboardData, true);
        });



        // Keydown
        htmlRootElement.addEventListener('keydown', (event) => {
            event.preventDefault();
            this.deleteRange();
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
    private deleteRange(currentElement: Element = this.selection.commonAncestorContainer, range: ElementRange = new ElementRange()): boolean {
        let done!: boolean;

        // If current element is start element
        if (currentElement.id == this.selection.startElement.id) {
            currentElement.delete(0, this.selection.startOffset);
            range.inRange = true;
        }

        // If current element is end element
        else if (currentElement.id == this.selection.endElement.id) {
            currentElement.delete(this.selection.endOffset);

            return true;
        }

        // Other
        else if (range.inRange) {
            if (!Element.search(this.selection.endElement.id, currentElement)) {
                currentElement.delete();
                return false;
            }
        }


        // Loop through each child
        for (let i = 0; i < currentElement.children.length; i++) {
            const child = currentElement.children[i];

            done = this.deleteRange(child, range);
            if (done) return true;
            if (done == false) {
                // If we are on the last child, return
                if (i == currentElement.children.length) return undefined!;

                // This will ensure we loop through all children
                i--;
            }
        }

        return done;
    }

}