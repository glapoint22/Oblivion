import { Image } from "./image";

export class Review {
    public title!: string;
    public rating!: number;
    public userName!: string;
    public profileImage!: Image;
    public date!: string;
    public isVerified!: boolean;
    public text!: string;
    public likes!: number;
    public dislikes!: number;
    public hasBeenRated?: boolean;
}