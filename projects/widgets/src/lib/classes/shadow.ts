export class Shadow {
    public enable: boolean = false;
    public x: number = 5;
    public y: number = 5;
    public blur: number = 5;
    public size: number = 5;
    public color: string = 'rgba(0, 0, 0, 0.75)';

    setData(shadow: Shadow) {
        if (shadow) {
            if (shadow.enable) this.enable = shadow.enable;
            if (shadow.x) this.x = shadow.x;
            if (shadow.y) this.y = shadow.y;
            if (shadow.blur) this.blur = shadow.blur;
            if (shadow.size) this.size = shadow.size;
            if (shadow.color) this.color = shadow.color;
        }
    }
}