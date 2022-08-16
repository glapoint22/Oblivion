import { HierarchyItem } from "./hierarchy-item";

export class NicheHierarchy {
  nicheId!: number;
  subNicheId!: number;
  subNiches!: Array<HierarchyItem>;
  products!: Array<HierarchyItem>;
}