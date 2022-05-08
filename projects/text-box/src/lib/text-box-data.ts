import { Link } from "common";
import { ElementType } from "./element-type";
import { StyleData } from "./style-data";

export class TextBoxData {
    public elementType!: ElementType;
    public children?: Array<TextBoxData>;
    public text?: string;
    public styles?: Array<StyleData>;
    public link?: Link;
    public indent?: number;
}