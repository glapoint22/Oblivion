import { Image } from "common";
import { ListPermissions } from "./list-permissions";

export class Collaborator {
    public id!: number;
    public name!: string;
    public profileImage!: Image;
    public listPermissions!: ListPermissions;
    public isRemoved!: boolean;
}