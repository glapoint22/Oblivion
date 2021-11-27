import { ListPermissions } from "./list-permissions";
import { ProfilePicInfo } from "./profile-pic-info";

export class List {
    public totalItems: number = 0;
    public ownerName: string = 'You';
    public listPermissions: ListPermissions = new ListPermissions();
    public collaboratorCount: number = 0;
    public isOwner: boolean = true;

    constructor(
        public id: string,
        public name: string,
        public description?: string,
        public collaborateId?: string,
        public profilePic?: ProfilePicInfo
    ) { }
}