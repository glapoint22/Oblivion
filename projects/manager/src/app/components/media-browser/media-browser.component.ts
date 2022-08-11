import { Component, ElementRef, ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DataService, Image, ImageSize, ImageSizeType, LazyLoad, LazyLoadingService, Media, MediaType, SpinnerAction, Video } from 'common';
import { debounceTime, fromEvent, map, of, switchMap } from 'rxjs';
import { MediaBrowserMode, MediaBrowserView, MenuOptionType } from '../../classes/enums';
import { ImageReference } from '../../classes/image-reference';
import { Item } from '../../classes/item';
import { MenuOption } from '../../classes/menu-option';
import { ContextMenuComponent } from '../context-menu/context-menu.component';
import { DropdownListComponent } from '../dropdown-list/dropdown-list.component';
import { ImageInfoComponent } from '../image-info/image-info.component';
import { ImageReferencesComponent } from '../image-references/image-references.component';
import { PromptComponent } from '../prompt/prompt.component';

@Component({
  selector: 'media-browser',
  templateUrl: './media-browser.component.html',
  styleUrls: ['./media-browser.component.scss']
})
export class MediaBrowserComponent extends LazyLoad {
  // @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  // public showAllMedia!: boolean;
  // public currentMediaType!: MediaType;

  // public mediaType = MediaType;
  // public searchMode!: boolean;
  // public editedImage!: Image;
  // public editedVideo!: Video;
  // public renamingVideo!: boolean;
  // public updatingVideo!: boolean;
  // public newImage!: string;
  // public isNewVideo!: boolean;
  // public newVideo!: Video;
  // public dragover!: boolean;
  // public callback!: Function;
  // public media: Array<Media> = [];
  // public invalidVideoLink!: boolean;
  // public noSearchResults!: boolean;
  // public imageSizeType!: ImageSizeType;
  // private imageFile!: File;
  // public invalidImageType = InvalidImageType;
  // public displayImage!: string;

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  @ViewChild('submitButton') submitButton!: ElementRef<HTMLButtonElement>;
  public view!: MediaBrowserView;
  public mediaBrowserView = MediaBrowserView;
  public imageSizeType!: ImageSizeType;
  public displayImage!: Image;
  public displayVideoName!: string;
  public media: Array<any> = [];
  public mediaType!: MediaType;
  public MediaType = MediaType;
  public callback!: Function;
  public currentImage!: Image;
  public submitButtonDisabled: boolean = true;
  public noSearchResults!: boolean;
  public imageFile!: File;
  public mode!: MediaBrowserMode;
  public mediaBrowserMode = MediaBrowserMode;
  public selectedMedia!: Media;
  public nameInputDisabled!: boolean;
  public showCancelButton!: boolean;
  public hasMultiImages!: boolean;
  private productName!: string;
  private dropdownList!: DropdownListComponent;
  private imageReference!: ImageReference;


  constructor
    (
      lazyLoadingService: LazyLoadingService,
      private dataService: DataService,
      private sanitizer: DomSanitizer
    ) { super(lazyLoadingService) }


  ngAfterViewInit() {
    super.ngAfterViewInit();

    fromEvent<InputEvent>(this.searchInput.nativeElement, 'input')
      .pipe(
        debounceTime(200),
        map((e: InputEvent) => (e.target as HTMLInputElement).value),
        switchMap((value: string) => {
          if (value == '') return of(null);
          return this.dataService.get<Array<Media>>('api/Media/Search', [
            {
              key: 'type',
              value: this.mediaType
            },
            {
              key: 'searchWords',
              value: value
            }
          ]);
        })
      ).subscribe((media: Array<Media> | null) => {
        this.media = [];

        if (media) {
          this.view = MediaBrowserView.SearchResults;

          media.forEach((media: Media) => this.media.push(new Media(media)));
          this.noSearchResults = media.length == 0;
        } else {
          this.clearSearchResults();
        }
      });
  }


  clearSearchResults() {
    this.searchInput.nativeElement.value = '';
    this.media = [];
    this.view = MediaBrowserView.ImageSelect;
  }


  init(mediaType: MediaType, currentMedia?: Image | Video, imageReference?: ImageReference, productName?: string) {
    this.mediaType = mediaType;

    if (mediaType == MediaType.Image) {
      this.imageReference = imageReference!;
      this.imageSizeType = imageReference!.imageSizeType;

      if (currentMedia && currentMedia.src) {
        this.view = MediaBrowserView.ImagePreview;
        this.mode = MediaBrowserMode.Update;
        this.displayImage = new Image();
        this.displayImage.id = currentMedia.id;
        this.displayImage.src = 'images/' + currentMedia.src;
        this.displayImage.name = currentMedia.name;
        this.currentImage = currentMedia as Image;
      } else {
        this.view = MediaBrowserView.ImageSelect;
        this.mode = MediaBrowserMode.New;

        if (productName) {
          this.displayImage = new Image();
          this.productName = this.displayImage.name = productName;
        }
      }
    } else {
      this.view = MediaBrowserView.VideoSelect;
      if (currentMedia?.src) {
        this.view = MediaBrowserView.VideoPreview;
        this.displayVideoName = currentMedia.name;

        window.setTimeout(() => {
          const editedVideoIframe = document.getElementById('editedVideoIframe') as HTMLIFrameElement;
          editedVideoIframe.src = currentMedia.src;
        });
      }
    }
  }













  // ---------------------------------------------------------------Open File Explorer------------------------------------------------
  public openFileExplorer(fileInput: HTMLInputElement): void {
    fileInput.value = '';
    fileInput.click();
  }





  // ---------------------------------------------------------------------On Drop----------------------------------------------------------
  public onDrop(event: DragEvent): void {
    event.preventDefault();
    this.setImageFile(event.dataTransfer!.files[0]);
  }




  // ------------------------------------------------------------------Set New Image----------------------------------------------------
  public setImageFile(imageFile: File): void {
    const reader = new FileReader();


    this.imageFile = imageFile;


    // Load the new image
    reader.onload = () => {
      if (!this.displayImage) this.displayImage = new Image();

      this.displayImage.src = reader.result!.toString();
      this.view = MediaBrowserView.ImagePreview;
      this.searchInput.nativeElement.value = '';
      this.nameInputDisabled = false;
      this.showCancelButton = true;

      window.setTimeout(() => {
        const nameInput = document.getElementById('name-input') as HTMLInputElement;

        this.submitButtonDisabled = nameInput.value == '';
        nameInput.select();
      });
    };

    reader.readAsDataURL(imageFile);
  }




  // ----------------------------------------------------------------On Back Button Click----------------------------------------------------
  onCancelClick() {
    this.showCancelButton = false;
    this.submitButtonDisabled = true;
    this.imageFile = null!;
    this.selectedMedia = null!;
    this.hasMultiImages = false;

    if (this.currentImage) {
      this.displayImage.src = 'images/' + this.currentImage.src;
      this.displayImage.name = this.currentImage.name;
      this.nameInputDisabled = false;
      if (this.mode == MediaBrowserMode.Swap || this.view == MediaBrowserView.ImageUpdate) {
        this.mode = MediaBrowserMode.Update;
        this.view = MediaBrowserView.ImagePreview;
      }
    } else {
      this.view = MediaBrowserView.ImageSelect;
      this.displayImage.name = this.productName;
    }

  }


  // -------------------------------------------------------------------Save New Image-------------------------------------------------------
  public saveImage(): void {
    const formData = new FormData()
    formData.append('image', this.imageFile);
    formData.append('name', this.displayImage.name);
    formData.append('imageSize', this.imageSizeType.toString());

    this.dataService.post<Media>('api/Media/Image', formData)
      .subscribe((media: Media) => {
        const newImage = new Image();

        newImage.id = media.id;
        newImage.name = media.name;
        newImage.src = media.src;
        newImage.thumbnail = media.thumbnail;

        this.imageReference.imageId = newImage.id;
        this.addImageReference();

        this.callback(newImage);
        this.close();
      });
  }



  // ------------------------------------------------------------------Update Image----------------------------------------------------
  public updateImage(): void {
    if (this.imageFile) {
      const formData = new FormData()

      formData.append('image', this.imageFile);
      formData.append('id', this.displayImage.id.toString());
      formData.append('imageSize', this.imageSizeType.toString());

      this.dataService.post<Image>('api/Media/UpdateImage', formData)
        .subscribe((image: Image) => {
          this.currentImage.src = image.src;
          if (this.displayImage.name == this.currentImage.name) {
            this.close();
          }
        });
    }

    if (this.displayImage.name != this.currentImage.name) {
      this.dataService.put('api/Media/Name', { id: this.displayImage.id, name: this.displayImage.name })
        .subscribe(() => {
          this.currentImage.name = this.displayImage.name;
          this.close();
        });
    }

  }




  // ------------------------------------------------------------------- On Submit -------------------------------------------------------
  onSubmit() {
    if (this.view == MediaBrowserView.ImagePreview) {
      if (this.mode == MediaBrowserMode.New || this.mode == MediaBrowserMode.Swap) {
        if (this.mode == MediaBrowserMode.Swap) this.removeImageReference();

        if (this.imageFile) {
          this.saveImage();
        } else {
          if (this.hasMultiImages) {
            this.loadDropdownList();
          } else {
            this.setSelectedMedia();
          }
        }
      } else if (this.mode == MediaBrowserMode.Update) {
        this.updateImage();
      }
    } else if (this.view == MediaBrowserView.VideoPreview) {

    }
  }






  // ------------------------------------------------------------------- Add Image Reference -------------------------------------------------------
  addImageReference() {
    this.dataService.post('api/Media/ImageReference', this.imageReference).subscribe();
  }



  // ------------------------------------------------------------------- Add Image Reference -------------------------------------------------------
  removeImageReference() {
    this.imageReference.imageId = this.currentImage.id;
    this.dataService.post('api/Media/ImageReference/Remove', this.imageReference).subscribe();
  }


  deleteImage() {
    let id!: number;

    if (this.selectedMedia) {
      id = this.selectedMedia.id;
    } else if (this.currentImage) {
      id = this.currentImage.id;
    }

    this.dataService.get<number>('api/Media/ImageReference', [{ key: 'imageId', value: id }])
      .subscribe((referenceCount: number) => {
        let message!: SafeHtml;
        let primaryButtonName!: string;
        let primaryButtonFunction!: Function;
        let secondaryButtonName!: string;
        let secondaryButtonFunction!: Function;

        if (referenceCount > 0) {
          message = this.sanitizer.bypassSecurityTrustHtml(
            'This image has ' + (referenceCount == 1 ? 'a dependency' : referenceCount + ' dependencies') +
            ' and cannot be deleted. Before continuing, ' +
            'you must remove all references to this image.');

          primaryButtonName = 'Ok';
          secondaryButtonName = 'Show References';
          secondaryButtonFunction = () => {
            if (this.selectedMedia) {
              this.openImageReferences(this.selectedMedia);
            } else if (this.currentImage) {
              this.dataService.get<Media>('api/Media/MediaInfo', [{ key: 'id', value: this.currentImage.id }])
                .subscribe((media: Media) => {
                  this.openImageReferences(media);
                });
            }
          }
        } else {
          message = this.sanitizer.bypassSecurityTrustHtml(
            'Are you sure you want to permanently delete this image?');

          primaryButtonName = 'Delete';
          primaryButtonFunction = () => {
            this.dataService.delete('api/Media', { id: id }).subscribe(() => {
              if (this.currentImage) {
                this.view = MediaBrowserView.ImagePreview;
                this.mode = MediaBrowserMode.Update;
                this.displayImage = new Image();
                this.displayImage.id = this.currentImage.id;
                this.displayImage.src = 'images/' + this.currentImage.src;
                this.displayImage.name = this.currentImage.name;
                this.nameInputDisabled = false;
              } else if (this.selectedMedia) {
                this.view = this.mediaBrowserView.ImageSelect;
              }

              this.showCancelButton = false;
              this.selectedMedia = null!;
              this.submitButtonDisabled = true;
            });
          }
          secondaryButtonName = 'Cancel';
        }


        this.lazyLoadingService.load(async () => {
          const { PromptComponent } = await import('../prompt/prompt.component');
          const { PromptModule } = await import('../prompt/prompt.module');

          return {
            component: PromptComponent,
            module: PromptModule
          }
        }, SpinnerAction.None)
          .then((prompt: PromptComponent) => {
            prompt.title = 'Delete Image';
            prompt.message = message
            prompt.primaryButton.name = primaryButtonName;
            prompt.primaryButton.buttonFunction = primaryButtonFunction;
            prompt.secondaryButton.name = secondaryButtonName;
            prompt.secondaryButton.buttonFunction = secondaryButtonFunction;
          });


      })


  }




  // ------------------------------------------------------------------- On Swap Image Click -------------------------------------------------------
  onSwapImageClick() {
    this.view = MediaBrowserView.ImageSelect;
    this.mode = MediaBrowserMode.Swap;
    this.showCancelButton = true;
  }




  // ---------------------------------------------------------------------- On Media Click ---------------------------------------------------------
  onMediaClick(media: Media) {
    this.selectedMedia = new Media(media);

    if (this.mediaType == MediaType.Image) {
      this.displayImage = new Image();
      this.displayImage.name = media.name;
      this.displayImage.src = 'images/' + this.selectedMedia
        .getImageSizes()
        .sort((a: ImageSize, b: ImageSize) => {
          return Math.max(a.width, a.height) > Math.max(b.width, b.height) ? 1 : -1;
        }).reverse()[0].src;

      this.view = MediaBrowserView.ImagePreview;
      this.searchInput.nativeElement.value = '';
      this.nameInputDisabled = true;
      this.submitButtonDisabled = false;
      this.showCancelButton = true;
      if (this.imageSizeType == ImageSizeType.AnySize) this.hasMultiImages = true;
    }
  }





  // --------------------------------------------------------------------Set Media-------------------------------------------------------
  public setSelectedMedia(): void {

    if (this.mediaType == MediaType.Video) {
      const video = new Video({
        video: {
          id: this.selectedMedia.id,
          name: this.selectedMedia.name,
          thumbnail: this.selectedMedia.thumbnail,
          videoType: this.selectedMedia.videoType,
          videoId: this.selectedMedia.videoId
        }
      });

      this.callback(video);
    } else {
      const image = new Image();

      image.id = this.selectedMedia.id;
      image.name = this.selectedMedia.name;
      image.thumbnail = this.selectedMedia.thumbnail;
      this.imageReference.imageId = image.id;
      this.addImageReference();

      if (this.imageSizeType == ImageSizeType.Small) {
        if (this.selectedMedia.imageSm) {
          image.src = this.selectedMedia.imageSm;
          this.callback(image);
        } else {
          const src = this.selectedMedia.imageAnySize ? this.selectedMedia.imageAnySize : this.selectedMedia.imageMd;

          this.addImageSize(image, src);
        }



      } else if (this.imageSizeType == ImageSizeType.Medium) {
        if (this.selectedMedia.imageMd) {
          image.src = this.selectedMedia.imageMd;
          this.callback(image);
        } else {
          const src = this.selectedMedia.imageAnySize ? this.selectedMedia.imageAnySize : this.selectedMedia.imageSm;

          this.addImageSize(image, src);
        }
      }
    }


    this.close();
  }



  addImageSize(image: Image, src: string) {
    this.dataService.get<Image>('api/Media/Image',
      [
        { key: 'imageId', value: this.selectedMedia.id },
        { key: 'imageSize', value: this.imageSizeType },
        { key: 'src', value: src }
      ]).subscribe((img: Image) => {
        image.src = img.src;
        this.callback(image);
      });
  }




  // -------------------------------------------------------------------------- Is UnderSize -------------------------------------------------------------
  isUnderSize(media: Media): boolean {
    if (!media) return false;

    // Small
    if (this.imageSizeType == ImageSizeType.Small) {
      // If we have an any size that is greater or equal to small, return false
      if (media.imageAnySize &&
        (media.imageAnySizeWidth >= ImageSizeType.Small ||
          media.imageAnySizeHeight >= ImageSizeType.Small)) return false;

      // If there is not a small size or the size is less than small return true
      if (!media.imageSm ||
        (media.imageSmWidth < ImageSizeType.Small &&
          media.imageSmHeight < ImageSizeType.Small)) return true;
    }

    // Medium
    else if (this.imageSizeType == ImageSizeType.Medium) {
      // If we have an any size that is greater or equal to medium, return false
      if (media.imageAnySize &&
        (media.imageAnySizeWidth >= ImageSizeType.Medium ||
          media.imageAnySizeHeight >= ImageSizeType.Medium)) return false;

      // If there is not a medium size or the size is less than medium return true
      if (!media.imageMd ||
        (media.imageMdWidth < ImageSizeType.Medium &&
          media.imageMdHeight < ImageSizeType.Medium)) return true;
    }

    return false;
  }



  onImagePreviewMousedown(event: MouseEvent) {
    if (event.button == 2) {
      if (this.selectedMedia) {
        this.openContextMenu(event, this.selectedMedia);
      } else if (this.currentImage && !this.imageFile) {
        this.dataService.get<Media>('api/Media/MediaInfo', [{ key: 'id', value: this.currentImage.id }])
          .subscribe((media: Media) => {
            this.openContextMenu(event, new Media(media));
          });
      } else {
        this.openContextMenu(event, null!);
      }
    }
  }

  // --------------------------------------------------------------------------- On Mousedown -------------------------------------------------------------
  openContextMenu(event: MouseEvent, media: Media) {
    this.lazyLoadingService.load(async () => {
      const { ContextMenuComponent } = await import('../../components/context-menu/context-menu.component');
      const { ContextMenuModule } = await import('../../components/context-menu/context-menu.module');

      return {
        component: ContextMenuComponent,
        module: ContextMenuModule
      }
    }, SpinnerAction.None)
      .then((contextMenu: ContextMenuComponent) => {
        contextMenu.xPos = event.clientX;
        contextMenu.yPos = event.clientY;
        contextMenu.options = [
          {
            type: MenuOptionType.MenuItem,
            name: 'Image info',
            isDisabled: !media,
            optionFunction: () => {
              this.openImageInfo(media);
            }
          },
          {
            type: MenuOptionType.MenuItem,
            name: 'Show all references',
            isDisabled: !media,
            optionFunction: () => this.openImageReferences(media)
          },
        ];
      });
  }




  // --------------------------------------------------- Open Image References ---------------------------------------------------
  private async openImageReferences(media: Media): Promise<void> {
    this.lazyLoadingService.load(async () => {
      const { ImageReferencesComponent } = await import('../image-references/image-references.component');
      const { ImageReferencesModule } = await import('../image-references/image-references.module');
      return {
        component: ImageReferencesComponent,
        module: ImageReferencesModule
      }
    }, SpinnerAction.None)
      .then((imageReferences: ImageReferencesComponent) => {
        imageReferences.media = media;
      });
  }




  // --------------------------------------------------- Open Image Info Popup ---------------------------------------------------
  public async openImageInfo(media: Media): Promise<void> {
    this.lazyLoadingService.load(async () => {
      const { ImageInfoComponent } = await import('../image-info/image-info.component');
      const { ImageInfoModule } = await import('../image-info/image-info.module');
      return {
        component: ImageInfoComponent,
        module: ImageInfoModule
      }
    }, SpinnerAction.None)
      .then((imageInfo: ImageInfoComponent) => {
        imageInfo.media = media;
        imageInfo.imageSizeType = this.imageSizeType;
        imageInfo.callback = (image: Image) => {
          this.callback(image);
          this.close();
        }
      });
  }




  // ------------------------------------------------------------------------ Load Dropdown List ----------------------------------------------------------
  async loadDropdownList() {
    const dropdownListElement = document.getElementById('dropdownList');

    if (dropdownListElement) {
      this.dropdownList.close();
      return;
    }

    this.lazyLoadingService.load(async () => {
      const { DropdownListComponent } = await import('../dropdown-list/dropdown-list.component');
      const { DropdownListModule } = await import('../dropdown-list/dropdown-list.module');
      return {
        component: DropdownListComponent,
        module: DropdownListModule
      }
    }, SpinnerAction.None)
      .then((dropdownList: DropdownListComponent) => {
        const rect = this.submitButton.nativeElement.getBoundingClientRect();
        const imageSizes = this.selectedMedia.getImageSizes();

        this.dropdownList = dropdownList;
        dropdownList.top = rect.top + rect.height;
        dropdownList.left = rect.left;
        dropdownList.list = [];

        imageSizes.forEach((imageSize: ImageSize) => {
          dropdownList.list.push({
            id: imageSize.imageSizeType,
            name: ImageSizeType[imageSize.imageSizeType] + ': ' + imageSize.width + ' x ' + imageSize.height
          })
        });

        dropdownList.callback = (item: Item) => {
          const image = new Image();
          const imageSize = imageSizes.find(x => x.imageSizeType == item.id)!;

          image.id = this.selectedMedia.id;
          image.name = this.selectedMedia.name;
          image.thumbnail = this.selectedMedia.thumbnail;
          image.src = imageSize.src;
          image.imageSizeType = imageSize.imageSizeType;

          this.imageReference.imageId = image.id;
          this.imageReference.imageSizeType = image.imageSizeType;
          this.addImageReference();

          this.callback(image);
          this.close();
        }
      });
  }



  onEnter(e: KeyboardEvent): void {
    if (!this.submitButtonDisabled) this.onSubmit();
  }


  // ---------------------------------------------------------- On Escape -----------------------------------------------------------
  onEscape(): void {
    if (this.lazyLoadingService.container.length > 1) return;
    super.onEscape();
  }


  // // -------------------------------------------------------------------Save New Video-------------------------------------------------------
  // public saveNewVideo(videoName: string): void {
  //   this.newVideo.name = videoName;

  //   this.dataService.post<Video>('api/Media/Video', this.newVideo)
  //     .subscribe((video: Video) => {
  //       if (video) {
  //         this.newVideo.id = video.id;
  //         this.newVideo.thumbnail = video.thumbnail;
  //         this.callback(this.newVideo);
  //         this.close();
  //       } else {
  //         // There was a problem saving the new video
  //         this.invalidVideoLink = true;
  //         this.isNewVideo = false!;
  //         window.setTimeout(() => {
  //           document.getElementById('videoInput')?.focus();
  //         });
  //       }
  //     });
  // }








  // // --------------------------------------------------------------------Set New Video-------------------------------------------------------
  // public setNewVideo(url: string): void {
  //   this.newVideo = new Video({ url: url });

  //   if (this.newVideo.src) {
  //     this.isNewVideo = true;
  //     window.setTimeout(() => {
  //       document.getElementById('title')?.focus();
  //       const iframe = document.getElementById('newVideoIframe') as HTMLIFrameElement;

  //       iframe.src = this.newVideo.src;
  //     });
  //   } else {
  //     this.invalidVideoLink = true;
  //   }
  // }









  // // --------------------------------------------------------------------Search Media-------------------------------------------------------
  // public searchMedia(searchWords: string): void {
  //   // this.clear(true);

  //   if (searchWords) {

  //     const params = [
  //       {
  //         key: 'type',
  //         value: this.mediaType
  //       },
  //       {
  //         key: 'searchWords',
  //         value: searchWords
  //       }
  //     ]

  //     this.media = [];

  //     this.dataService.get<Array<Media>>('api/Media/Search', [
  //       {
  //         key: 'type',
  //         value: this.mediaType
  //       },
  //       {
  //         key: 'searchWords',
  //         value: searchWords
  //       }
  //     ])
  //       .subscribe((media: Array<Media>) => {
  //         this.view = MediaBrowserView.SearchResults;

  //         media.forEach((media: Media) => this.media.push(new Media(media)));
  //         // this.noSearchResults = media.length == 0;
  //       });
  //   } else {
  //     this.view = MediaBrowserView.ImageSelect;
  //   }
  // }




  // // --------------------------------------------------------------------Clear-------------------------------------------------------
  // public clear(preserveSearchInput?: boolean): void {
  //   this.searchMode = false;
  //   this.newImage = null!;
  //   this.isNewVideo = false;
  //   this.noSearchResults = null!;
  //   this.media = null!;
  //   this.invalidVideoLink = null!;
  //   if (!preserveSearchInput) this.searchInput.nativeElement.value = '';

  // }






  // // ------------------------------------------------------------On Searched Media Click------------------------------------------------
  // public onSearchedMediaClick(media: Media) {
  //   if (this.currentMediaType == MediaType.Video) {

  //   } else {
  //     const image = new Image();

  //     image.id = media.id;
  //     image.name = media.name;
  //     image.thumbnail = media.thumbnail;
  //     image.src = media.imageAnySize ? media.imageAnySize : media.imageMd ? media.imageMd : media.imageSm;
  //     this.editedImage = image;
  //     this.searchMode = false;
  //   }
  // }









  // // ---------------------------------------------------------------On Rename Image Click--------------------------------------------------
  // // onRenameImageClick(input: HTMLInputElement) {
  // //   this.renamingImage = true;

  // //   window.setTimeout(() => {
  // //     input.select();
  // //   });
  // // }






  // // ---------------------------------------------------------------------Rename Image--------------------------------------------------------
  // renameImage(newName: string) {
  //   this.dataService.put('api/Media/Name', { id: this.editedImage.id, name: newName })
  //     .subscribe(() => {
  //       this.editedImage.name = newName;
  //       this.close();
  //     });
  // }







  // // ------------------------------------------------------------------On Rename Image Click----------------------------------------------------
  // onRenameVideoClick(input: HTMLInputElement) {
  //   this.renamingVideo = true;

  //   window.setTimeout(() => {
  //     input.select();
  //   });
  // }






  // // ---------------------------------------------------------------------Rename Video--------------------------------------------------------
  // renameVideo(newName: string) {
  //   this.dataService.put('api/Media/Name', { id: this.editedVideo.id, name: newName })
  //     .subscribe(() => {
  //       this.editedVideo.name = newName;
  //       this.close();
  //     });
  // }












  // // ------------------------------------------------------------------Update Video----------------------------------------------------
  // public updateVideo(url: string): void {
  //   const video = new Video({ url: url });

  //   if (video.src) {
  //     this.editedVideo.videoId = video.videoId;

  //     this.dataService.put<Video>('api/Media/UpdateVideo', this.editedVideo)
  //       .subscribe((updatedVideo: Video) => {
  //         this.editedVideo.thumbnail = updatedVideo.thumbnail;
  //         this.editedVideo.src = video.src;
  //         this.close();
  //       });
  //   } else {
  //     this.invalidVideoLink = true;
  //   }
  // }





  // // ----------------------------------------------------------------On Delete Media Click-------------------------------------------------
  // async onDeleteMediaClick() {
  //   this.lazyLoadingService.load(async () => {
  //     const { PromptComponent } = await import('../prompt/prompt.component');
  //     const { PromptModule } = await import('../prompt/prompt.module');

  //     return {
  //       component: PromptComponent,
  //       module: PromptModule
  //     }
  //   }, SpinnerAction.None).then((prompt: PromptComponent) => {
  //     const media = this.currentMediaType == MediaType.Image ? 'image' : 'video';

  //     const message = '<span style="color: #ff0000; font-weight: bold">Warning: </span><span>This operation cannot be undone. ' +
  //       'Before proceeding, make sure there are no dependencies on this ' + media + '. </span><span style="font-weight: bold; ' +
  //       'text-decoration: underline">Continue at your own risk!</span>';

  //     prompt.parentObj = this;
  //     prompt.title = 'Delete ' + media;
  //     prompt.message = this.sanitizer.bypassSecurityTrustHtml(message);
  //     prompt.primaryButton = {
  //       name: 'Delete',
  //       buttonFunction: this.deleteMedia
  //     }
  //     prompt.secondaryButton = {
  //       name: 'Cancel'
  //     }
  //   });
  // }





  // // --------------------------------------------------------------------Delete Image------------------------------------------------------
  // deleteMedia() {
  //   this.dataService.delete('api/Media', {
  //     id: this.currentMediaType == MediaType.Image ? this.editedImage.id : this.editedVideo.id
  //   }).subscribe(() => {
  //     this.close();
  //   });
  // }










  // // --------------------------------------------------------------------Display Edited Video------------------------------------------------------
  // displayEditedVideo(video: Video) {
  //   this.editedVideo = video;

  //   window.setTimeout(() => {
  //     const editedVideoIframe = document.getElementById('editedVideoIframe') as HTMLIFrameElement;

  //     editedVideoIframe.src = this.editedVideo.src;
  //   });
  // }










}