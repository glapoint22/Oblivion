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
}