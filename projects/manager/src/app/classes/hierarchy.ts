import { HierarchyItem } from "./hierarchy-item";

export class Hierarchy {
    name!: string;
    indentId!: number;
    hidden?: boolean;
    children!: Array<HierarchyItem>;
}

export enum HierarchyType {
    Checkbox,
    EditableCheckbox
}