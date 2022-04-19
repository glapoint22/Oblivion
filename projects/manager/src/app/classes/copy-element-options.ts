import { NodeType } from "widgets";
import { ElementRange } from "./element-range";

export class CopyElementOptions {
    public createNewChildId?: boolean;
    public changeType?: NodeType;
    public range?: ElementRange;
    public preserveId?: boolean;
}