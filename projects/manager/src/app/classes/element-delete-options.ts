import { SelectedElementOnDeletion } from "./enums";

export class ElementDeleteOptions {
    public selectedChildOnDeletion?: SelectedElementOnDeletion;
    public preserveContainer?: boolean;
}