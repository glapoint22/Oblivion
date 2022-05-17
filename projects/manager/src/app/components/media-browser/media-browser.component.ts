import { Component, ElementRef, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { DataService, Image, LazyLoad, LazyLoadingService, Media, MediaType, SpinnerAction, VideoType } from 'common';
import { PromptComponent } from '../prompt/prompt.component';

@Component({
  selector: 'media-browser',
  templateUrl: './media-browser.component.html',
  styleUrls: ['./media-browser.component.scss']
})
export class MediaBrowserComponent extends LazyLoad {
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  public showAllMedia!: boolean;
  public currentMediaType!: MediaType;
  public mediaType = MediaType;
  public searchMode!: boolean;
  public editedImage!: Image;
  public renamingImage!: boolean;
  public updatingImage!: boolean;
  public newImage!: string;
  public newVideo!: SafeUrl;
  public dragover!: boolean;
  public callback!: Function;
  public searchedMedia: Array<Media> = [];
  public invalidVideoLink!: boolean;
  public noSearchResults!: boolean;
  private imageFile!: File;
  private videoMedia!: Media;


  constructor
    (
      lazyLoadingService: LazyLoadingService,
      private dataService: DataService,
      private sanitizer: DomSanitizer
    ) { super(lazyLoadingService) }





  // ---------------------------------------------------------------Open File Explorer------------------------------------------------
  public openFileExplorer(fileInput: HTMLInputElement): void {
    fileInput.value = '';
    fileInput.click();
  }






  // ------------------------------------------------------------------Set New Image----------------------------------------------------
  public setNewImage(imageFile: File): void {
    const reader = new FileReader();

    this.imageFile = imageFile;

    // Load the new image
    reader.onload = () => {
      this.newImage = reader.result!.toString();
      window.setTimeout(() => {
        document.getElementById('title')?.focus();
      });
    };

    reader.readAsDataURL(imageFile);
  }








  // --------------------------------------------------------------------On Dragover---------------------------------------------------------
  public onDragover(event: DragEvent): void {
    this.dragover = true;
    event.preventDefault();
  }









  // ---------------------------------------------------------------------On Drop----------------------------------------------------------
  public onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragover = false;

    if (this.updatingImage) {
      this.updateImage(event.dataTransfer!.files[0])
    } else {
      this.setNewImage(event.dataTransfer!.files[0]);
    }
  }








  // -------------------------------------------------------------------Save New Image-------------------------------------------------------
  public saveNewImage(imageName: string): void {
    const formData = new FormData()
    formData.append('image', this.imageFile);
    formData.append('name', imageName);

    this.dataService.post<Media>('api/Media/Image', formData)
      .subscribe((media: Media) => {
        this.setMedia(media);
      });
  }







  // -------------------------------------------------------------------Save New Video-------------------------------------------------------
  public saveNewVideo(videoName: string): void {
    this.videoMedia.name = videoName;

    this.dataService.post<Media>('api/Media/Video', this.videoMedia)
      .subscribe((media: Media) => {
        if (media) {
          this.setMedia(media);
        } else {
          // There was a problem saving the new video
          this.invalidVideoLink = true;
          this.newVideo = null!;
          window.setTimeout(() => {
            document.getElementById('videoInput')?.focus();
          });
        }
      });
  }






  // --------------------------------------------------------------------Set New Video-------------------------------------------------------
  public setNewVideo(url: string): void {
    let videoId!: string;
    let result!: RegExpExecArray;
    let pattern!: RegExp;
    let videoType!: VideoType;

    this.invalidVideoLink = false;

    // YouTube
    pattern = /(?:https?:\/\/)?(?:(?:(?:www\.?)?youtube\.com(?:\/(?:(?:watch\?.*?(?:v=([^&\s]+)).*)|(?:v\/(.*))|(?:embed\/(.+))))?)|(?:youtu\.be\/(.*)?))/;
    result = pattern.exec(url)!;
    videoType = VideoType.YouTube;

    // Vimeo
    if (!result) {
      pattern = /(?:(?:https?:)?\/\/(?:[\w]+\.)*vimeo\.com(?:[\/\w:]*(?:\/videos)?)?\/([0-9]+)[^\s]*)/;
      result = pattern.exec(url)!;
      videoType = VideoType.Vimeo;
    }


    // Wistia
    if (!result) {
      pattern = /wvideo=([a-zA-Z0-9]+)|\/\/fast\.wistia\.net\/embed\/iframe\/([a-zA-Z0-9]+)/;
      result = pattern.exec(url)!;
      videoType = VideoType.Wistia;
    }


    if (result) {
      // Get the video Id from the regex result
      for (let i = 1; i < result.length; i++) {
        if (result[i] != undefined) {
          videoId = result[i];
          break;
        }
      }

      // Set the media properties
      this.videoMedia = new Media();
      this.videoMedia.videoId = videoId;
      this.videoMedia.videoType = videoType;
      this.videoMedia.type = MediaType.Video;

      // Set the new video
      this.newVideo = this.sanitizer.bypassSecurityTrustResourceUrl(Media.getVideoSrc(this.videoMedia));
      window.setTimeout(() => {
        document.getElementById('title')?.focus();
      });
    } else {
      this.invalidVideoLink = true;
    }
  }









  // --------------------------------------------------------------------Search Media-------------------------------------------------------
  public searchMedia(searchWords: string): void {
    this.clear(true);

    if (searchWords) {
      this.searchMode = true;

      this.dataService.get<Array<Media>>('api/Media/Search', [{ key: 'type', value: this.currentMediaType }, { key: 'searchWords', value: searchWords }])
        .subscribe((media: Array<Media>) => {
          this.searchedMedia = media;
          this.noSearchResults = media.length == 0;
        });
    }
  }




  // --------------------------------------------------------------------Clear-------------------------------------------------------
  public clear(preserveSearchInput?: boolean): void {
    this.searchMode = false;
    this.newImage = null!;
    this.newVideo = null!;
    this.noSearchResults = null!;
    this.searchedMedia = null!;
    this.invalidVideoLink = null!;
    if (!preserveSearchInput) this.searchInput.nativeElement.value = '';

  }












  // --------------------------------------------------------------------Set Media-------------------------------------------------------
  public setMedia(media: Media): void {
    this.callback(media);
    this.close();
  }









  // ---------------------------------------------------------------On Rename Image Click--------------------------------------------------
  onRenameImageClick(input: HTMLInputElement) {
    this.renamingImage = true;

    window.setTimeout(() => {
      input.select();
    });
  }





  // ---------------------------------------------------------------------Rename Image--------------------------------------------------------
  renameImage(newName: string) {
    this.dataService.put('api/Media/Name', { id: this.editedImage.id, name: newName })
      .subscribe(() => {
        this.editedImage.name = newName;
        this.close();
      });
  }






  // ------------------------------------------------------------------Update Image----------------------------------------------------
  public updateImage(imageFile: File): void {
    const formData = new FormData()

    formData.append('image', imageFile);
    formData.append('id', this.editedImage.id.toString());

    this.dataService.post<any>('api/Media/UpdateImage', formData)
      .subscribe((image: any) => {
        this.editedImage.src = image.src;
        this.close();
      });
  }





  // ----------------------------------------------------------------On Delete Image Click-------------------------------------------------
  async onDeleteImageClick() {
    this.lazyLoadingService.load(async () => {
      const { PromptComponent } = await import('../prompt/prompt.component');
      const { PromptModule } = await import('../prompt/prompt.module');

      return {
        component: PromptComponent,
        module: PromptModule
      }
    }, SpinnerAction.None).then((prompt: PromptComponent) => {
      const message = '<span style="color: #ff0000; font-weight: bold">Warning: </span><span>This operation cannot be undone. ' +
        'Before proceeding, make sure there are no dependencies on this image. </span><span style="font-weight: bold; ' +
        'text-decoration: underline">Continue at your own risk!</span>';

      prompt.parentObj = this;
      prompt.title = 'Delete Image';
      prompt.message = this.sanitizer.bypassSecurityTrustHtml(message);
      prompt.primaryButton = {
        name: 'Delete',
        buttonFunction: this.deleteImage
      }
      prompt.secondaryButton = {
        name: 'Cancel'
      }
    });
  }





  // --------------------------------------------------------------------Delete Image------------------------------------------------------
  deleteImage() {
    this.dataService.delete('api/Media', {
      id: this.editedImage.id
    }).subscribe(() => {
      this.close();
    });
  }
}