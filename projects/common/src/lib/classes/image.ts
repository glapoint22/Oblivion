export class Image {
    public id!: number;
    public name!: string;
    public url!: string;

    setData(image: Image) {
        if (image) {
            this.id = image.id;
            this.url = image.url;
            this.name = image.name;
        }
    }
}