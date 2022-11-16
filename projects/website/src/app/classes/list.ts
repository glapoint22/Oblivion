import { Image } from "common";
import { ListPermissions } from "./list-permissions";

export class List {
    public totalProducts: number = 0;
    public ownerName: string = 'You';
    public listPermissions: ListPermissions = new ListPermissions();
    public collaboratorCount: number = 0;
    public isOwner: boolean = true;

    constructor(
        public id: string,
        public name: string,
        public description?: string,
        public collaborateId?: string,
        public ownerProfileImage?: Image
    ) { }
}