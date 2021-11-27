import { Image } from "./image";
import { ListPermissions } from "./list-permissions";

export class Collaborator {
    public id!: number;
    public name!: string;
    public image!: Image;
    public listPermissions!: ListPermissions;
    public isRemoved!: boolean;
}