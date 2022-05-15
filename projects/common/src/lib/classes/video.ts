export class Video {
    public id!: number;
    public src!: string;
    public thumbnail!: string;

    setData(video: Video) {
        if (video) {
            this.id = video.id;
            this.src = video.src;
            this.thumbnail = video.thumbnail;
        }
    }
}