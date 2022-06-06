import { LinkType } from "./link-type";

export class Link {
    public url!: string;
    public linkType: LinkType = LinkType.None;

    setData(link: Link) {
        if (link) {
            if (link.linkType) this.linkType = link.linkType;
            if (link.url) this.url = link.url;
        }
    }


    getData(): Link {
        if (this.linkType == LinkType.None) return null!;
        const link = new Link();

        link.url = this.url;
        link.linkType = this.linkType;

        return link;
    }
}