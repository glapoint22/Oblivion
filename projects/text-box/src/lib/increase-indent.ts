import { Element } from "./element";
import { ElementType } from "./element-type";
import { Selection } from "./selection";
import { Style } from "./style";

export class IncreaseIndent extends Style {

    constructor(selection: Selection) {
        super(selection);

    }

    // ---------------------------------------------------------Set Style-------------------------------------------------------------
    public setStyle(): void {
        const selectedContainers = this.getSelectedContainers();

        selectedContainers.forEach((container: Element) => {
            if (container.elementType == ElementType.Div) {
                container.setIndent(1);
            } else {
                const index = container.index;
                const list = container.parent.create(container.parent);
                const newListItem = container.copy(list, { preserveSelection: this.selection });

                list.children.push(newListItem);
                container.parent.children.splice(index, 1, list);

                this.selection.resetSelection(container, newListItem, true);
            }
        });
    }


    // ---------------------------------------------------------Set Selected Style-------------------------------------------------------------
    public setSelectedStyle(): void {
        throw new Error("Method not implemented.");
    }
}