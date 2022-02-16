import { BackgroundImage } from "./background-image";

export class Background {
    public color!: string;
    public image!: BackgroundImage;
    public enable!: boolean;

    setData(background: Background) {
        if (background) {
            if (background.color) this.color = background.color;
            if (background.image) this.image = background.image;
            if (background.enable) this.enable = background.enable;
        }
    }
}