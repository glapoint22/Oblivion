import { KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DataService, ImageSizeType, LazyLoad, LazyLoadingService, Media } from 'common';
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
            const imageSize = this.media.getImageSizes().filter(x => x.imageSizeType == imageReference.imageSizeType)[0];
            values.push({
              name: imageSize.width + ' x ' + imageSize.height,
              width: '100px'
            });

            // Builder
            values.push({
              name: BuilderType[imageReference.builderType],
              width: '80px'
            });


            // Host
            values.push({
              name: imageReference.host,
              width: '290px'
            });


            // Location
            values.push({
              name: ImageLocation[imageReference.imageLocation].replace(/\w(?=[A-Z])/, (x) => x + ' '),
              width: '200px'
            });

            this.sourceList.push({
              values: values
            });
          });
      });
  }
}