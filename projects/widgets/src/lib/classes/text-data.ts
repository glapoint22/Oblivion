import { StyleData } from "./style-data";
import { NodeType } from "./widget-enums";

export class TextData {
   public nodeType!: NodeType;
   public children?: Array<TextData>;
   public text?: string;
   public styles?: Array<StyleData>;
   public link?: string;
   public indent?: number;
}