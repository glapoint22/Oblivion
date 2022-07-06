import { ColorProperty } from "./color-property";
import { Enableable } from "./enableable";

export class Shadow extends ColorProperty implements Enableable {
    public enabled: boolean = false;
    public x: number = 5;
    public y: number = 5;
    public blur: number = 5;
    public size: number = 5;

    setData(shadow: Shadow) {
        if (shadow) {
            if (shadow.enabled) this.enabled = shadow.enabled;
            if (shadow.x) this.x = shadow.x;
            if (shadow.y) this.y = shadow.y;
            if (shadow.blur) this.blur = shadow.blur;
            if (shadow.size) this.size = shadow.size;
            if (shadow.color) this.color = shadow.color;
        }
    }

    getData(): Shadow {
        if (!this.enabled) return null!;
        const shadow = new Shadow();

        shadow.enabled = this.enabled;
        shadow.x = this.x;
        shadow.y = this.y;
        shadow.blur = this.blur;
        shadow.size = this.size;
        shadow.color = this.color;

        return shadow;
    }


    public getDefaultColor(): string {
        return '#000000bf';
    }
}