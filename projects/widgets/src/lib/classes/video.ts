export class Video {
    public id!: number;
    public url!: string;
    public thumbnail!: string;

    setData(video: Video) {
        if (video) {
            this.id = video.id;
            this.url = video.url;
            this.thumbnail = video.thumbnail;
        }
    }
}