import { Component, ElementRef, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DataService, Image, LazyLoad, LazyLoadingService, Media, MediaType, SpinnerAction, Video } from 'common';
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
  public editedVideo!: Video;
  public renamingImage!: boolean;
  public renamingVideo!: boolean;
  public updatingImage!: boolean;
  public updatingVideo!: boolean;
  public newImage!: string;
  public isNewVideo!: boolean;
  public newVideo!: Video;
  public dragover!: boolean;
  public callback!: Function;
  public searchedMedia: Array<Media> = [];
  public invalidVideoLink!: boolean;
  public noSearchResults!: boolean;
  private imageFile!: File;


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
        const newImage = new Image();

        newImage.id = media.id;
        newImage.name = media.name;
        newImage.src = media.src;
        newImage.thumbnail = media.thumbnail;
        this.callback(newImage);
        this.close();
      });
  }







  // -------------------------------------------------------------------Save New Video-------------------------------------------------------
  public saveNewVideo(videoName: string): void {
    this.newVideo.name = videoName;

    this.dataService.post<Video>('api/Media/Video', this.newVideo)
      .subscribe((video: Video) => {
        if (video) {
          this.newVideo.id = video.id;
          this.newVideo.thumbnail = video.thumbnail;
          this.callback(this.newVideo);
          this.close();
        } else {
          // There was a problem saving the new video
          this.invalidVideoLink = true;
          this.isNewVideo = false!;
          window.setTimeout(() => {
            document.getElementById('videoInput')?.focus();
          });
        }
      });
  }








  // --------------------------------------------------------------------Set New Video-------------------------------------------------------
  public setNewVideo(url: string): void {
    this.newVideo = new Video({ url: url });

    if (this.newVideo.src) {
      this.isNewVideo = true;
      window.setTimeout(() => {
        document.getElementById('title')?.focus();
        const iframe = document.getElementById('newVideoIframe') as HTMLIFrameElement;

        iframe.src = this.newVideo.src;
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
    this.isNewVideo = false;
    this.noSearchResults = null!;
    this.searchedMedia = null!;
    this.invalidVideoLink = null!;
    if (!preserveSearchInput) this.searchInput.nativeElement.value = '';

  }












  // --------------------------------------------------------------------Set Media-------------------------------------------------------
  public setMedia(media: Media): void {
    if (this.currentMediaType == MediaType.Video) {
      const video = new Video({
        video: {
          id: media.id,
          name: media.name,
          thumbnail: media.thumbnail,
          videoType: media.videoType,
          videoId: media.videoId
        }
      });

      this.callback(video);
    } else {
      const image = new Image();

      image.id = media.id;
      image.name = media.name;
      image.src = media.src;
      image.thumbnail = media.thumbnail;

      this.callback(image);
    }


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







  // ------------------------------------------------------------------On Rename Image Click----------------------------------------------------
  onRenameVideoClick(input: HTMLInputElement) {
    this.renamingVideo = true;

    window.setTimeout(() => {
      input.select();
    });
  }






  // ---------------------------------------------------------------------Rename Video--------------------------------------------------------
  renameVideo(newName: string) {
    this.dataService.put('api/Media/Name', { id: this.editedVideo.id, name: newName })
      .subscribe(() => {
        this.editedVideo.name = newName;
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






  // ------------------------------------------------------------------Update Video----------------------------------------------------
  public updateVideo(url: string): void {
    const video = new Video({ url: url });

    if (video.src) {
      this.editedVideo.videoId = video.videoId;

      this.dataService.put<Video>('api/Media/UpdateVideo', this.editedVideo)
        .subscribe((updatedVideo: Video) => {
          this.editedVideo.thumbnail = updatedVideo.thumbnail;
          this.editedVideo.src = video.src;
          this.close();
        });
    } else {
      this.invalidVideoLink = true;
    }
  }





  // ----------------------------------------------------------------On Delete Media Click-------------------------------------------------
  async onDeleteMediaClick() {
    this.lazyLoadingService.load(async () => {
      const { PromptComponent } = await import('../prompt/prompt.component');
      const { PromptModule } = await import('../prompt/prompt.module');

      return {
        component: PromptComponent,
        module: PromptModule
      }
    }, SpinnerAction.None).then((prompt: PromptComponent) => {
      const media = this.currentMediaType == MediaType.Image ? 'image' : 'video';

      const message = '<span style="color: #ff0000; font-weight: bold">Warning: </span><span>This operation cannot be undone. ' +
        'Before proceeding, make sure there are no dependencies on this ' + media + '. </span><span style="font-weight: bold; ' +
        'text-decoration: underline">Continue at your own risk!</span>';

      prompt.parentObj = this;
      prompt.title = 'Delete ' + media;
      prompt.message = this.sanitizer.bypassSecurityTrustHtml(message);
      prompt.primaryButton = {
        name: 'Delete',
        buttonFunction: this.deleteMedia
      }
      prompt.secondaryButton = {
        name: 'Cancel'
      }
    });
  }





  // --------------------------------------------------------------------Delete Image------------------------------------------------------
  deleteMedia() {
    this.dataService.delete('api/Media', {
      id: this.currentMediaType == MediaType.Image ? this.editedImage.id : this.editedVideo.id
    }).subscribe(() => {
      this.close();
    });
  }










  // --------------------------------------------------------------------Display Edited Video------------------------------------------------------
  displayEditedVideo(video: Video) {
    this.editedVideo = video;

    window.setTimeout(() => {
      const editedVideoIframe = document.getElementById('editedVideoIframe') as HTMLIFrameElement;

      editedVideoIframe.src = this.editedVideo.src;
    });
  }




  // ---------------------------------------------------------------------------On Escape-------------------------------------------------------------
  // onEscape(): void {
  //   this.callback();
  //   super.onEscape();
  // }
}