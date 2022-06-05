export class Image {
    public id!: number;
    public name!: string;
    public src!: string;
    public thumbnail!: string;

    setData(image: Image) {
        if (image) {
            this.id = image.id;
            this.src = image.src;
            this.name = image.name;
            this.thumbnail = image.thumbnail;
        }
    }



    getData(): Image {
        if (!this.src) return null!;
        const image = new Image();

        image.id = this.id;
        image.name = this.name;
        image.src = this.src;
        image.thumbnail = this.thumbnail;

        return image;
    }
}