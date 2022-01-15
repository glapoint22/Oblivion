import { LinkOption } from "./enums";

export class Link {
    public id!: number;
    public selectedOption!: LinkOption;
    public url!: string;
    public optionValue!: string;
}