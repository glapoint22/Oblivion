import { KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DataService, ImageSize, ImageSizeType, LazyLoad, LazyLoadingService, Media } from 'common';
import { BuilderType, ImageLocation } from '../../classes/enums';
import { ImageReference } from '../../classes/image-reference';
import { MultiColumnItem } from '../../classes/multi-column-item';
import { MultiColumnItemValue } from '../../classes/multi-column-item-value';

@Component({
  selector: 'image-references',
  templateUrl: './image-references.component.html',
  styleUrls: ['./image-references.component.scss']
})
export class ImageReferencesComponent extends LazyLoad implements OnInit {
  public media!: Media;
  public imageSizeType: number = -1;
  public sourceList: Array<MultiColumnItem> = [];

  constructor(lazyLoadingService: LazyLoadingService, private dataService: DataService) { super(lazyLoadingService) }

  public ngOnInit(): void {
    super.ngOnInit();

    const params: Array<KeyValue<any, any>> = new Array<KeyValue<any, any>>();
    params.push({ key: 'imageId', value: this.media.id });

    if (this.imageSizeType != -1) {
      params.push({ key: 'imageSize', value: this.imageSizeType })
    }

    this.dataService.get<Array<ImageReference>>('api/Media/ImageReferences', params)
      .subscribe((imageReferences: Array<ImageReference>) => {


        imageReferences
          .forEach((imageReference: ImageReference) => {
            const values = new Array<MultiColumnItemValue>();

            // Size
            const imageSize = this.getImageSize(imageReference.imageSizeType);
            values.push({
              name: imageSize.width + ' x ' + imageSize.height,
              width: '100px'
            });

            // Builder
            values.push({
              name: BuilderType[imageReference.builder],
              width: '80px'
            });


            // Host
            values.push({
              name: imageReference.host,
              width: '290px'
            });


            // Location
            values.push({
              name: ImageLocation[imageReference.location].replace(/\w(?=[A-Z])/, (x) => x + ' '),
              width: '200px'
            });

            this.sourceList.push({
              values: values
            });
          });
      });
  }


  getImageSize(imageSizeType: ImageSizeType): ImageSize {
    const imageSize = new ImageSize();

    switch (imageSizeType) {
      case ImageSizeType.AnySize:
        imageSize.width = this.media.imageAnySizeWidth;
        imageSize.height = this.media.imageAnySizeHeight;
        break;

      case ImageSizeType.Large:
        imageSize.width = this.media.imageLgWidth;
        imageSize.height = this.media.imageLgHeight;
        break;

      case ImageSizeType.Medium:
        imageSize.width = this.media.imageMdWidth;
        imageSize.height = this.media.imageMdHeight;
        break;

      case ImageSizeType.Small:
        imageSize.width = this.media.imageSmWidth;
        imageSize.height = this.media.imageSmHeight;
        break;


      case ImageSizeType.Thumbnail:
        imageSize.width = this.media.thumbnailWidth;
        imageSize.height = this.media.thumbnailHeight;
        break;
    }

    return imageSize;
  }
}