import { HierarchyItem } from "./hierarchy-item";

export class Hierarchy {
    id!: number;
    name!: string;
    indentId!: number;
    hidden?: boolean;
    children!: Array<HierarchyItem>;
}