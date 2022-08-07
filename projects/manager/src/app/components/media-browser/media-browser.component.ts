import { Component, ElementRef, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DataService, Image, ImageSize, ImageSizeType, LazyLoad, LazyLoadingService, Media, MediaType, SpinnerAction, Video } from 'common';
import { InvalidImageType, MediaBrowserView, MenuOptionType } from '../../classes/enums';
import { MenuOption } from '../../classes/menu-option';
import { ContextMenuComponent } from '../context-menu/context-menu.component';
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


  public view!: MediaBrowserView;
  public mediaBrowserView = MediaBrowserView;
  public imageSizeType!: ImageSizeType;
  public displayImage!: Image;
  public displayVideoName!: string;
  public media: Array<any> = [];
  public mediaType!: MediaType;
  public MediaType = MediaType;
  public callback!: Function;
  private imageFile!: File;


  init(mediaType: MediaType, currentMedia?: Image | Video, imageSizeType?: ImageSizeType) {
    this.mediaType = mediaType;

    if (mediaType == MediaType.Image) {
      this.imageSizeType = imageSizeType!;

      if (currentMedia && currentMedia.src) {
        this.view = MediaBrowserView.ImagePreview;

        this.displayImage = new Image();
        this.displayImage.src = 'images/' + currentMedia.src;
        this.displayImage.name = currentMedia.name;
      } else {
        this.view = MediaBrowserView.ImageSelect;
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





  // ---------------------------------------------------------------------On Drop----------------------------------------------------------
  public onDrop(event: DragEvent): void {
    event.preventDefault();
    this.setNewImage(event.dataTransfer!.files[0]);
  }




  // ------------------------------------------------------------------Set New Image----------------------------------------------------
  public setNewImage(imageFile: File): void {
    const reader = new FileReader();

    this.imageFile = imageFile;
    this.view = MediaBrowserView.ImagePreview;

    // Load the new image
    reader.onload = () => {
      this.displayImage = new Image();
      this.displayImage.src = reader.result!.toString();


      window.setTimeout(() => {
        document.getElementById('title')?.focus();
      });
    };

    reader.readAsDataURL(imageFile);
  }






  // -------------------------------------------------------------------Save New Image-------------------------------------------------------
  public saveNewImage(): void {
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
        this.callback(newImage);
        this.close();
      });
  }




  // ------------------------------------------------------------------- On Apply -------------------------------------------------------
  onApply() {
    this.saveNewImage();
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
  //   this.clear(true);

  //   if (searchWords) {
  //     this.searchMode = true;
  //     const params = [
  //       {
  //         key: 'type',
  //         value: this.currentMediaType
  //       },
  //       {
  //         key: 'searchWords',
  //         value: searchWords
  //       }
  //     ]

  //     this.dataService.get<Array<Media>>('api/Media/Search', params).subscribe((media: Array<Media>) => {
  //       this.media = [];

  //       media.forEach((media: Media) => this.media.push(new Media(media)));
  //       this.noSearchResults = media.length == 0;
  //     });
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





  // // --------------------------------------------------------------------Set Media-------------------------------------------------------
  // public setMedia(media: Media, forceUse?: boolean): void {
  //   if (!forceUse && this.isInvalid(media) > 0) return;

  //   if (this.currentMediaType == MediaType.Video) {
  //     const video = new Video({
  //       video: {
  //         id: media.id,
  //         name: media.name,
  //         thumbnail: media.thumbnail,
  //         videoType: media.videoType,
  //         videoId: media.videoId
  //       }
  //     });

  //     this.callback(video);
  //   } else {
  //     const image = new Image();

  //     image.id = media.id;
  //     image.name = media.name;
  //     image.thumbnail = media.thumbnail;

  //     if (this.imageSizeType == ImageSizeType.Small) {
  //       if (media.imageSm) {
  //         image.src = media.imageSm;
  //         this.callback(image);
  //       } else {
  //         const src = media.imageAnySize ? media.imageAnySize : media.imageMd;

  //         this.addImageSize(media, image, src);
  //       }



  //     } else if (this.imageSizeType == ImageSizeType.Medium) {
  //       if (media.imageMd) {
  //         image.src = media.imageMd;
  //         this.callback(image);
  //       } else {
  //         const src = media.imageAnySize ? media.imageAnySize : media.imageSm;

  //         this.addImageSize(media, image, src);
  //       }

  //     } else if (this.imageSizeType == ImageSizeType.AnySize) {
  //       if (media.imageAnySize) {
  //         image.src = media.imageAnySize;
  //         this.callback(image);
  //       } else {
  //         let src!: string;

  //         if (media.imageSm) {
  //           src = media.imageSm;
  //         } else if (media.imageMd) {
  //           src = media.imageMd;
  //         } else if (media.imageLg) {
  //           src = media.imageLg;
  //         }

  //         this.addImageSize(media, image, src);
  //       }
  //     }
  //   }


  //   this.close();
  // }



  // addImageSize(media: Media, image: Image, src: string) {
  //   this.dataService.get<Image>('api/Media/Image',
  //     [
  //       { key: 'imageId', value: media.id },
  //       { key: 'imageSize', value: this.imageSizeType },
  //       { key: 'src', value: src }
  //     ]).subscribe((img: Image) => {
  //       image.src = img.src;
  //       this.callback(image);
  //     });
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





  // // ------------------------------------------------------------------Update Image----------------------------------------------------
  // public updateImage(imageFile: File): void {
  //   // const formData = new FormData()

  //   // formData.append('image', imageFile);
  //   // formData.append('id', this.editedImage.id.toString());
  //   // formData.append('imageSize', this.imageSizeType.toString());

  //   // this.dataService.post<any>('api/Media/UpdateImage', formData)
  //   //   .subscribe((image: any) => {
  //   //     this.editedImage.src = image.src;
  //   //     this.close();
  //   //   });

  //   const reader = new FileReader();

  //   // this.imageFile = imageFile;

  //   // Load the new image
  //   reader.onload = () => {
  //     this.displayImage = reader.result!.toString();
  //     // window.setTimeout(() => {
  //     //   document.getElementById('title')?.focus();
  //     // });
  //   };

  //   reader.readAsDataURL(imageFile);
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




  // // ---------------------------------------------------------------------------Is Invalid-------------------------------------------------------------
  // isInvalid(media: Media): number {
  //   // Small
  //   if (this.imageSizeType == ImageSizeType.Small) {
  //     // If we have an any size that is greater or equal to small, return false
  //     if (media.imageAnySize &&
  //       (media.imageAnySizeWidth >= ImageSizeType.Small ||
  //         media.imageAnySizeHeight >= ImageSizeType.Small)) return InvalidImageType.NotInvalid;

  //     // If there is not a small size or the size is less than small return true
  //     if (!media.imageSm ||
  //       (media.imageSmWidth < ImageSizeType.Small &&
  //         media.imageSmHeight < ImageSizeType.Small)) return InvalidImageType.UnderSize;
  //   }

  //   // Medium
  //   else if (this.imageSizeType == ImageSizeType.Medium) {
  //     // If we have an any size that is greater or equal to medium, return false
  //     if (media.imageAnySize &&
  //       (media.imageAnySizeWidth >= ImageSizeType.Medium ||
  //         media.imageAnySizeHeight >= ImageSizeType.Medium)) return InvalidImageType.NotInvalid;

  //     // If there is not a medium size or the size is less than medium return true
  //     if (!media.imageMd ||
  //       (media.imageMdWidth < ImageSizeType.Medium &&
  //         media.imageMdHeight < ImageSizeType.Medium)) return InvalidImageType.UnderSize;
  //   }

  //   // Any Size
  //   else if (this.imageSizeType == ImageSizeType.AnySize) {
  //     const imageSizes = media.getImageSizes();

  //     return imageSizes.length > 1 ? InvalidImageType.MultipleSizes : InvalidImageType.NotInvalid;
  //   }

  //   return InvalidImageType.NotInvalid;
  // }




  // // --------------------------------------------------------------------------- On Mousedown -------------------------------------------------------------
  // onMousedown(event: MouseEvent, media: Media) {
  //   if (event.button == 2) {
  //     this.lazyLoadingService.load(async () => {
  //       const { ContextMenuComponent } = await import('../../components/context-menu/context-menu.component');
  //       const { ContextMenuModule } = await import('../../components/context-menu/context-menu.module');

  //       return {
  //         component: ContextMenuComponent,
  //         module: ContextMenuModule
  //       }
  //     }, SpinnerAction.None)
  //       .then((contextMenu: ContextMenuComponent) => {
  //         contextMenu.xPos = event.clientX;
  //         contextMenu.yPos = event.clientY;

  //         const isHidden = this.isInvalid(media) == InvalidImageType.NotInvalid;

  //         contextMenu.options = [
  //           {
  //             type: MenuOptionType.MenuItem,
  //             name: 'Image info',
  //             optionFunction: () => {
  //               this.openImageInfo(media);
  //             }
  //           },
  //           {
  //             type: MenuOptionType.MenuItem,
  //             name: 'Show all references',
  //             optionFunction: () => this.openImageReferences(media)
  //           },
  //           {
  //             type: MenuOptionType.Divider
  //           },
  //           {
  //             type: MenuOptionType.MenuItem,
  //             name: 'Edit image',
  //             optionFunction: () => {
  //               const image = new Image();

  //               // This will get the biggest resolution for the image src
  //               const src = media.getImageSizes()
  //                 .sort((a: ImageSize, b: ImageSize) => Math.max(a.width, a.height) > Math.max(b.width, b.height) ? 1 : -1)
  //                 .reverse()[0].src;

  //               image.id = media.id;
  //               image.name = media.name;
  //               image.src = src;

  //               this.searchMode = false;
  //               this.editedImage = image;
  //             }
  //           },
  //           {
  //             type: MenuOptionType.Divider,
  //             hidden: isHidden || this.imageSizeType == ImageSizeType.AnySize
  //           },
  //           {
  //             type: MenuOptionType.MenuItem,
  //             name: 'Use image',
  //             hidden: isHidden || this.imageSizeType == ImageSizeType.AnySize,
  //             optionFunction: () => this.setMedia(media, true)
  //           }
  //         ];

  //         if (this.imageSizeType == ImageSizeType.AnySize && !isHidden) {
  //           const image = new Image();

  //           image.id = media.id;
  //           image.name = media.name;
  //           image.thumbnail = media.thumbnail;

  //           const imageSizes = media.getImageSizes();
  //           const sizeOptions: Array<MenuOption> = [];

  //           imageSizes.forEach((imageSize: ImageSize) => {
  //             sizeOptions.push({
  //               type: MenuOptionType.MenuItem,
  //               name: imageSize.width + ' x ' + imageSize.height,
  //               optionFunction: () => {
  //                 image.src = imageSize.src;
  //                 image.imageSizeType = imageSize.imageSizeType;

  //                 this.callback(image);
  //                 this.close();
  //               }
  //             });
  //           });

  //           contextMenu.options.push(
  //             {
  //               type: MenuOptionType.Divider
  //             },
  //             {
  //               type: MenuOptionType.Submenu,
  //               name: 'Use image size',
  //               options: sizeOptions
  //             }
  //           );
  //         }
  //       });
  //   }
  // }



  // // --------------------------------------------------- Open Image References ---------------------------------------------------
  // private async openImageReferences(media: Media): Promise<void> {
  //   this.lazyLoadingService.load(async () => {
  //     const { ImageReferencesComponent } = await import('../image-references/image-references.component');
  //     const { ImageReferencesModule } = await import('../image-references/image-references.module');
  //     return {
  //       component: ImageReferencesComponent,
  //       module: ImageReferencesModule
  //     }
  //   }, SpinnerAction.None)
  //     .then((imageReferences: ImageReferencesComponent) => {
  //       imageReferences.media = media;
  //     });
  // }




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
    // .then((imageInfo: ImageInfoComponent) => {
    //   imageInfo.media = media;
    //   imageInfo.imageSizeType = this.imageSizeType;
    //   imageInfo.callback = (image: Image) => {
    //     this.callback(image);
    //     this.close();
    //   }
    // });
  }



  // // ---------------------------------------------------------- On Escape -----------------------------------------------------------
  // onEscape(): void {
  //   if (this.lazyLoadingService.container.length > 1) return;
  //   super.onEscape();
  // }
}