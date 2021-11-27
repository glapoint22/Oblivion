import { Image } from "./image";

export class Customer {
    public profileImage!: Image;

    constructor(public firstName: string, public lastName: string, public email: string, image: string) {
        this.profileImage = new Image(firstName + ' ' + lastName, image ? 'images/' + image : 'assets/no-account-pic.png');
    }
}