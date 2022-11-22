import { Image } from "./image";

export class User {
    public profileImage: Image = new Image();
    public hasProfileImage!: boolean;

    constructor(public firstName: string, public lastName: string, public email: string, image: string, public externalLoginProvider: string, public hasPassword: boolean) {
        this.profileImage.name = firstName + ' ' + lastName;
        this.profileImage.src = image ? image : null!;
        this.hasProfileImage = image != '';
    }
}