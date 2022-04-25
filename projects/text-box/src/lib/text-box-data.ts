import { ElementType } from "./element-type";
import { Link } from "./link";
import { Style } from "./style";

export class TextBoxData {
    public elementType!: ElementType;
    public children?: Array<TextBoxData>;
    public text?: string;
    public styles?: Array<Style>;
    public link?: Link;
    public indent?: number;
}