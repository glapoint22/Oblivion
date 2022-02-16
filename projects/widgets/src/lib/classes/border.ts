export class Border {
    public enable: boolean = false;
    public width: number = 1;
    public style: string = 'solid';
    public color: string = '#bebebe';

    setData(border: Border) {
        if (border) {
            if (border.enable) this.enable = border.enable;
            if (border.width) this.width = border.width;
            if (border.style) this.style = border.style;
            if (border.color) this.color = border.color;
        }
    }
}