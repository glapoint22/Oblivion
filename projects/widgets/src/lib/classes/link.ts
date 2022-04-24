import { LinkOption } from "./widget-enums";

export class Link {
    public selectedOption: LinkOption = LinkOption.None;
    public url!: string;

    setData(link: Link) {
        if (link) {
            if (link.selectedOption) this.selectedOption = link.selectedOption;
            if (link.url) this.url = link.url;
        }
    }
}