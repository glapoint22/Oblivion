import { Component, OnInit } from '@angular/core';
import { DataService, Image, ImageSize, ImageSizeType, LazyLoad, LazyLoadingService, Media, SpinnerAction } from 'common';
import { ListUpdateType, MediaBrowserView, MenuOptionType } from '../../classes/enums';
import { MediaReference } from '../../classes/media-reference';
import { ListOptions } from '../../classes/list-options';
import { ListUpdate } from '../../classes/list-update';
import { MultiColumnItem } from '../../classes/multi-column-item';
import { MultiColumnItemValue } from '../../classes/multi-column-item-value';
import { MultiColumnListUpdate } from '../../classes/multi-column-list-update';
import { MediaReferencesComponent } from '../media-references/media-references.component';
import { MediaBrowserComponent } from '../media-browser/media-browser.component';

@Component({
  selector: 'image-info',
  templateUrl: './image-info.component.html',
  styleUrls: ['./image-info.component.scss']
})
export class ImageInfoComponent extends LazyLoad implements OnInit {
  public media!: Media;
  public sourceList: Array<MultiColumnItem> = [];
  public menuOptions: ListOptions = new ListOptions();
  public selectedImageSize!: ImageSize;
  // public callback!: Function;
  public mediaBrowser!: MediaBrowserComponent;
  private imageSizes!: Array<ImageSize>;
  private mediaReferences!: Array<MediaReference>;

  constructor(lazyLoadingService: LazyLoadingService, private dataService: DataService) { super(lazyLoadingService) }

  // --------------------------------------------------------- Ng OnInit ---------------------------------------------------
  public ngOnInit(): void {
    super.ngOnInit();
    this.imageSizes = this.media.getImageSizes();

    // Grab the image references
    this.dataService.get<Array<MediaReference>>('api/Media/MediaReferences', [{ key: 'mediaId', value: this.media.id }])
      .subscribe((mediaReferences: Array<MediaReference>) => {
        this.mediaReferences = mediaReferences;

        this.imageSizes.forEach((imageSize: ImageSize) => {
          const values = new Array<MultiColumnItemValue>();
          values.push({
            name: ImageSizeType[imageSize.imageSizeType].replace(/\w(?=[A-Z])/g, (x) => x + ' '),
            width: '90px'
          });

          values.push({
            name: imageSize.width.toString(),
            width: '65px'
          });

          values.push({
            name: imageSize.height.toString(),
            width: '65px'
          });

          values.push({
            name: imageSize.src,
            width: '300px'
          });

          values.push({
            name: mediaReferences.filter(x => this.getSrc(x.imageSizeType) == imageSize.src).length.toString(),
            width: '100px'
          });

          this.sourceList.push({
            values: values
          });
        });

        this.menuOptions = {
          // Menu
          menu: {
            parentObj: this,
            menuOptions: [
              {
                type: MenuOptionType.MenuItem,
                isDisabled: this.mediaBrowser.imageSizeType != ImageSizeType.AnySize || this.mediaBrowser.view == MediaBrowserView.ImagePreview,
                name: 'Use this image size',
                optionFunction: () => {
                  this.mediaBrowser.setSelectedImageSize(this.selectedImageSize);
                  this.close();
                }
              },
              {
                type: MenuOptionType.MenuItem,
                name: 'Show references',
                optionFunction: () => {
                  this.openMediaReferences();
                }
              },
              {
                type: MenuOptionType.Divider
              },
              {
                type: MenuOptionType.MenuItem,
                name: 'Open image in a new tab',
                optionFunction: () => {
                  window.open('images/' + this.selectedImageSize.src);
                }
              }
            ]
          }
        }
      });
  }



  // --------------------------------------------------- Open Image References ---------------------------------------------------
  private async openMediaReferences(): Promise<void> {
    this.lazyLoadingService.load(async () => {
      const { MediaReferencesComponent } = await import('../media-references/media-references.component');
      const { MediaReferencesModule } = await import('../media-references/media-references.module');
      return {
        component: MediaReferencesComponent,
        module: MediaReferencesModule
      }
    }, SpinnerAction.None)
      .then((mediaReferences: MediaReferencesComponent) => {
        mediaReferences.media = this.media;
        mediaReferences.imageSrc = this.selectedImageSize.src;
        mediaReferences.mediaReferences = this.mediaReferences;
      });
  }



  // --------------------------------------------------------- On Selection ---------------------------------------------------------
  onSelection(update: ListUpdate) {
    if (update.type == ListUpdateType.SelectedItems) {
      const src = (update.selectedItems![0] as MultiColumnListUpdate).values![3].name

      this.selectedImageSize = this.imageSizes.find(x => x.src == src)!;
      this.menuOptions.menu!.menuOptions[1].isDisabled = !this.mediaReferences.find(x => this.getSrc(x.imageSizeType) == src);

    }
  }


  // ------------------------------------------------------------ Get Src ------------------------------------------------------------
  getSrc(imageSizeType: ImageSizeType): string {
    let src!: string;

    switch (imageSizeType) {
      case ImageSizeType.AnySize:
        src = this.media.imageAnySize;
        break;

      case ImageSizeType.Thumbnail:
        src = this.media.thumbnail;
        break;

      case ImageSizeType.Small:
        src = this.media.imageSm;
        break;

      case ImageSizeType.Medium:
        src = this.media.imageMd;
        break;

      case ImageSizeType.Large:
        src = this.media.imageLg;
        break;
    }

    return src;
  }


  // ----------------------------------------------------------- On Escape -----------------------------------------------------------
  onEscape(): void {
    if (this.lazyLoadingService.container.length > 2) return;
    super.onEscape();
  }
}
