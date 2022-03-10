import { Style } from "./style";
import { NodeType } from "./widget-enums";

export class TextData {
   public nodeType!: NodeType;
   public children?: Array<TextData>;
   public text?: string;
   public styles?: Array<Style>;
   public link?: string;
}