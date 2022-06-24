import { ColorProperty } from "./color-property";
import { Enableable } from "./enableable";

export class Border extends ColorProperty implements Enableable {
    public enabled!: boolean;
    public width: number = 1;
    public style: string = 'solid';

    setData(border: Border) {
        if (border) {
            if (border.enabled) this.enabled = border.enabled;
            if (border.width) this.width = border.width;
            if (border.style) this.style = border.style;
            if (border.color) this.color = border.color;
        }
    }


    getData(): Border {
        if (!this.enabled) return null!;
        const border = new Border();

        border.enabled = this.enabled;
        border.width = this.width;
        border.style = this.style;
        border.color = this.color;

        return border;
    }


    public getDefaultColor(): string {
        return '#bebebe';
    }
}