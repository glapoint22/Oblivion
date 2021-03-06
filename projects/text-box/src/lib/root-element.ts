import { Element } from "./element";
import { ElementType } from "./element-type";

export class RootElement extends Element {
    
    constructor() {
        super();
        this.elementType = ElementType.Root;
    }


    // ---------------------------------------------------Generate Html-----------------------------------------------------
    public generateHtml(parent: HTMLElement, isDev?: boolean): void {
        throw new Error("Method not implemented.");
    }


    // ---------------------------------------------------Create-----------------------------------------------------
    public create(parent: Element): Element {
        throw new Error("Method not implemented.");
    }
}