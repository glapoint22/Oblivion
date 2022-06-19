import { BackgroundImage } from "./background-image";
import { ColorProperty } from "./color-property";
import { Enableable } from "./enableable";

export class Background extends ColorProperty implements Enableable {
    public image: BackgroundImage = new BackgroundImage();
    public enabled!: boolean;

    setData(background: Background) {
        if (background) {
            if (background.color) this.color = background.color;
            if (background.image) this.image.setData(background.image);
            if (background.enabled) this.enabled = background.enabled;
        }
    }



    getData(): Background {
        const background = new Background();

        background.color = this.color;
        if (this.image) background.image = this.image.getData();
        background.enabled = this.enabled;

        return background;
    }


    public getDefaultColor(): string {
        return '#ffffff';
    }
}