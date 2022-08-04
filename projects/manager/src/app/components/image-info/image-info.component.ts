import { Component, OnInit } from '@angular/core';
import { DataService, Image, ImageSize, ImageSizeType, LazyLoad, LazyLoadingService, Media, SpinnerAction } from 'common';
import { ListUpdateType, MenuOptionType } from '../../classes/enums';
import { ImageReference } from '../../classes/image-reference';
import { ListOptions } from '../../classes/list-options';
import { ListUpdate } from '../../classes/list-update';
import { MultiColumnItem } from '../../classes/multi-column-item';
import { MultiColumnItemValue } from '../../classes/multi-column-item-value';
import { MultiColumnListUpdate } from '../../classes/multi-column-list-update';
import { ImageReferencesComponent } from '../image-references/image-references.component';

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
  public imageSizeType!: ImageSizeType;
  public callback!: Function;
  private imageSizes!: Array<ImageSize>;
  private imageReferences!: Array<ImageReference>;

  constructor(lazyLoadingService: LazyLoadingService, private dataService: DataService) { super(lazyLoadingService) }

  // --------------------------------------------------------- Ng OnInit ---------------------------------------------------
  public ngOnInit(): void {
    super.ngOnInit();
    this.imageSizes = this.media.getImageSizes();

    // Grab the image references
    this.dataService.get<Array<ImageReference>>('api/Media/ImageReferences', [{ key: 'imageId', value: this.media.id }])
      .subscribe((imageReferences: Array<ImageReference>) => {
        this.imageReferences = imageReferences;

        this.imageSizes.forEach((imageSize: ImageSize) => {
          const values = new Array<MultiColumnItemValue>();
          values.push({
            name: ImageSizeType[imageSize.imageSizeType].replace(/\w(?=[A-Z])/, (x) => x + ' '),
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
            name: imageReferences.filter(x => x.imageSizeType == imageSize.imageSizeType).length.toString(),
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
                isDisabled: this.imageSizeType != ImageSizeType.AnySize,
                name: 'Use this image size',
                optionFunction: () => {
                  const image = new Image();

                  image.id = this.media.id;
                  image.name = this.media.name;
                  image.thumbnail = this.media.thumbnail;
                  image.src = this.selectedImageSize.src;
                  image.imageSizeType = this.selectedImageSize.imageSizeType;
                  this.callback(image);
                  this.close();
                }
              },
              {
                type: MenuOptionType.MenuItem,
                name: 'Show references',
                optionFunction: () => {
                  this.openImageReferences();
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
  private async openImageReferences(): Promise<void> {
    this.lazyLoadingService.load(async () => {
      const { ImageReferencesComponent } = await import('../image-references/image-references.component');
      const { ImageReferencesModule } = await import('../image-references/image-references.module');
      return {
        component: ImageReferencesComponent,
        module: ImageReferencesModule
      }
    }, SpinnerAction.None)
      .then((imageReferences: ImageReferencesComponent) => {
        imageReferences.media = this.media;
        imageReferences.imageSizeType = this.selectedImageSize.imageSizeType;
      });
  }



  // --------------------------------------------------------- On Selection ---------------------------------------------------------
  onSelection(update: ListUpdate) {
    if (update.type == ListUpdateType.SelectedItems) {
      const width = parseInt((update.selectedItems![0] as MultiColumnListUpdate).values![1].name);
      const height = parseInt((update.selectedItems![0] as MultiColumnListUpdate).values![2].name);

      this.selectedImageSize = this.imageSizes.find(x => x.width == width && x.height == height)!;
      this.menuOptions.menu!.menuOptions[1].isDisabled = !this.imageReferences.find(x => x.imageSizeType == this.selectedImageSize.imageSizeType);

    }
  }


  // ----------------------------------------------------------- On Escape -----------------------------------------------------------
  onEscape(): void {
    if (this.lazyLoadingService.container.length > 2) return;
    super.onEscape();
  }
}
