import { Component } from '@angular/core';
import { DataService, Image, LazyLoad, LazyLoadingService, Media, MediaType } from 'common';

@Component({
  selector: 'media-browser',
  templateUrl: './media-browser.component.html',
  styleUrls: ['./media-browser.component.scss']
})
export class MediaBrowserComponent extends LazyLoad {
  public showAllMedia!: boolean;
  public currentMediaType!: MediaType;
  public mediaType = MediaType;
  public inSearchMode!: boolean;
  public localImage!: string;
  public dragover!: boolean;
  public callback!: Function;
  public searchedMedia: Array<Media> = [];
  public noSearchResults!: boolean;
  private newImage!: File;


  constructor(lazyLoadingService: LazyLoadingService, private dataService: DataService) { super(lazyLoadingService) }


  public onUploadImageClick(fileInput: HTMLInputElement): void {
    // Clear the input (This is so the same filename can be re-entered again and again)
    fileInput.value = '';

    // Open the file explorer window
    fileInput.click();
  }



  setLocalImage(image: File) {
    const reader = new FileReader();
    this.newImage = image;

    reader.onload = () => {
      this.localImage = reader.result!.toString();
      window.setTimeout(() => {
        document.getElementById('title')?.focus();
      });

    };

    reader.readAsDataURL(image);
  }



  onDragover(event: DragEvent) {
    this.dragover = true;
    event.preventDefault();
  }



  onDrop(event: DragEvent) {
    event.preventDefault();
    this.dragover = false;
    this.setLocalImage(event.dataTransfer!.files[0]);
  }


  onSubmit(imageName: string) {
    const formData = new FormData()
    formData.append('image', this.newImage);
    formData.append('name', imageName);

    this.dataService.post<Image>('api/Media/Image', formData)
      .subscribe((newImage: Image) => {
        this.callback(newImage);
        this.close();
      });
  }


  search(value: string) {
    this.inSearchMode = false;

    if (value) {
      this.inSearchMode = true;

      this.dataService.get<Array<Media>>('api/Media/Search', [{ key: 'type', value: this.currentMediaType }, { key: 'searchWords', value: value }])
        .subscribe((media: Array<Media>) => {
          this.searchedMedia = media;
          this.noSearchResults = media.length == 0;
        });
    }
  }


  onMediaClick(media: Media) {
    const image = new Image();

    image.id = media.id;
    image.name = media.name;
    image.url = media.image;

    this.callback(image);
    this.close();
  }
}