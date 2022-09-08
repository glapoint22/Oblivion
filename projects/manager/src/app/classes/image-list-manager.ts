import { ImageItem } from "./image-item";
import { ListManager } from "./list-manager";

export class ImageListManager extends ListManager {


    // =======================================================================( SORT )======================================================================== \\

    sort(listItem: ImageItem) {
        this.sourceList.sort((a, b) => (a.name! > b.name!) ? 1 : -1);
        this.restoreIndent();
    }


    // ==================================================================( RESTORE INDENT )=================================================================== \\

    restoreIndent() {
        const listItemIndex = this.sourceList.findIndex(x => x == this.editedItem);

        if (this.editedItem) {
            this.editedItem = (this.sourceList[listItemIndex] as ImageItem) = {
                id: this.editedItem.id,
                name: this.editedItem.name,
                image: (this.editedItem as ImageItem).image,
                case: this.editedItem.case
            }
        }
    }
}