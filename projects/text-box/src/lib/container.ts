import { Element } from "./element";
import { ElementDeleteStatus } from "./element-delete-status";

export abstract class Container extends Element {

    
    // ---------------------------------------------------Delete-----------------------------------------------------
    public delete(startOffset?: number, endOffset?: number): ElementDeleteStatus {
        // This is the start element
        if (startOffset == 0 && endOffset == 0) {
            // Remove the child
            this.children.splice(0, 1);

            return ElementDeleteStatus.NotDeleted;
        } else if (startOffset == 0) {
            return ElementDeleteStatus.NotDeleted;
        }

        // Delete this element
        return super.delete(startOffset, endOffset);
    }
}