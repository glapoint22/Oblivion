import { HierarchyItem } from "./hierarchy-item";

export class NicheHierarchy {
  nicheId!: number;
  subnicheId!: number;
  subniches!: Array<HierarchyItem>;
  products!: Array<HierarchyItem>;
}