import { ListPermissions } from "./list-permissions";
import { ProfilePicInfo } from "./profile-pic-info";

export class List {
    public id!: string;
    public name!: string;
    public description!: string;
    public totalItems!: number;
    public owner!: string;
    public collaborateId!: string;
    public profilePic!: ProfilePicInfo;
    public listPermissions!: ListPermissions;
    public collaboratorCount!: number;
}