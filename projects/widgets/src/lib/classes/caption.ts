export class Caption {
    public fontWeight: string = 'normal';
    public fontStyle: string = 'normal';
    public textDecoration: string = 'none';
    public font: string = 'Arial, Helvetica, sans-serif';
    public fontSize: string = '14';
    public color: string = '#c8c8c8';
    public text!: string;

    setData(caption: Caption) {
        if (caption) {
            if (caption.fontWeight) this.fontWeight = caption.fontWeight;
            if (caption.fontStyle) this.fontStyle = caption.fontStyle;
            if (caption.textDecoration) this.textDecoration = caption.textDecoration;
            if (caption.font) this.font = caption.font;
            if (caption.fontSize) this.fontSize = caption.fontSize;
            if (caption.color) this.color = caption.color;
            if (caption.text) this.text = caption.text;
        }
    }
}