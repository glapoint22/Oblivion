import { Image } from "common";

export class Customer {
    public profileImage!: Image;
    public hasProfileImage!: boolean;

    constructor(public firstName: string, public lastName: string, public email: string, image: string, public externalLoginProvider: string, public hasPassword: boolean) {
        this.profileImage = new Image(firstName + ' ' + lastName, image ? 'images/' + image : 'assets/no-account-pic.png');
        this.hasProfileImage = image != '';
    }
}