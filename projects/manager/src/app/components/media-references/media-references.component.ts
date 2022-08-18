import { KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DataService, ImageSize, ImageSizeType, LazyLoad, LazyLoadingService, Media } from 'common';
import { BuilderType, MediaLocation } from '../../classes/enums';
import { MediaReference } from '../../classes/media-reference';
import { MultiColumnItem } from '../../classes/multi-column-item';
import { MultiColumnItemValue } from '../../classes/multi-column-item-value';

@Component({
  selector: 'media-references',
  templateUrl: './media-references.component.html',
  styleUrls: ['./media-references.component.scss']
})
export class MediaReferencesComponent extends LazyLoad implements OnInit {
  public media!: Media;
  public imageSrc!: string;
  public sourceList: Array<MultiColumnItem> = [];
  public mediaReferences!: Array<MediaReference>;

  constructor(lazyLoadingService: LazyLoadingService, private dataService: DataService) { super(lazyLoadingService) }

  public ngOnInit(): void {
    super.ngOnInit();

    if (!this.mediaReferences) {
      this.dataService.get<Array<MediaReference>>('api/Media/MediaReferences', [{ key: 'mediaId', value: this.media.id }])
        .subscribe((mediaReferences: Array<MediaReference>) => {
          this.createSourceList(mediaReferences);
        });
    } else {
      this.createSourceList(this.mediaReferences);
    }
  }



  createSourceList(mediaReferences: Array<MediaReference>) {
    mediaReferences
      .forEach((mediaReference: MediaReference) => {
        const values = new Array<MultiColumnItemValue>();
        const imageSize = this.getImageSize(mediaReference.imageSizeType);

        if (!this.imageSrc || this.imageSrc == imageSize.src) {
          values.push({
            name: imageSize.width + ' x ' + imageSize.height,
            width: '100px'
          });

          // Builder
          values.push({
            name: BuilderType[mediaReference.builder],
            width: '80px'
          });


          // Host
          values.push({
            name: mediaReference.host!,
            width: '290px'
          });


          // Location
          values.push({
            name: MediaLocation[mediaReference.location].replace(/\w(?=[A-Z])/g, (x) => x + ' '),
            width: '200px'
          });

          this.sourceList.push({
            values: values
          });
        }

      });
  }


  getImageSize(imageSizeType: ImageSizeType): ImageSize {
    const imageSize = new ImageSize();

    switch (imageSizeType) {
      case ImageSizeType.AnySize:
        imageSize.width = this.media.imageAnySizeWidth;
        imageSize.height = this.media.imageAnySizeHeight;
        imageSize.src = this.media.imageAnySize;
        break;

      case ImageSizeType.Large:
        imageSize.width = this.media.imageLgWidth;
        imageSize.height = this.media.imageLgHeight;
        imageSize.src = this.media.imageLg;
        break;

      case ImageSizeType.Medium:
        imageSize.width = this.media.imageMdWidth;
        imageSize.height = this.media.imageMdHeight;
        imageSize.src = this.media.imageMd;
        break;

      case ImageSizeType.Small:
        imageSize.width = this.media.imageSmWidth;
        imageSize.height = this.media.imageSmHeight;
        imageSize.src = this.media.imageSm;
        break;


      case ImageSizeType.Thumbnail:
        imageSize.width = this.media.thumbnailWidth;
        imageSize.height = this.media.thumbnailHeight;
        imageSize.src = this.media.thumbnail;
        break;
    }

    return imageSize;
  }
}