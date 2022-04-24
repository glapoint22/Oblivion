import { NodeType } from "widgets";
import { DivElement } from "./div-element";
import { Element } from "./element";
import { ListItemElement } from "./list-item-element";
import { Style } from "./style";

export class Indent extends Style {
    protected indentValue!: number;

    public setStyle(): void {
        const selectedContainers = this.getSelectedContainers();

        selectedContainers.forEach((container: Element) => {
            if (container.nodeType == NodeType.Div) {
                const divElement = container as DivElement;

                divElement.setIndent(this.indentValue);
            } else if (container.nodeType == NodeType.Li) {
                const listItemElement = container as ListItemElement;

                listItemElement.setIndent(this.indentValue);
            }
        });

        this.text.selection.resetSelection(this.text.root, this.text.selection.startOffset, this.text.selection.endOffset);
        this.text.merge();
        this.text.render();
        this.finalizeStyle();
    }


    public setSelectedStyle(): void {
        // throw new Error("Method not implemented.");
    }

}