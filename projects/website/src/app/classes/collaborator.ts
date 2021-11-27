import { ListPermissions } from "./list-permissions";
import { ProfilePicInfo } from "./profile-pic-info";

export class Collaborator {
    public id!: number;
    public name!: string;
    public image!: ProfilePicInfo;
    public listPermissions!: ListPermissions;
    public isRemoved!: boolean;
}