import { KeyValue } from "@angular/common";
import { Image } from "common";

export class BackgroundImage extends Image {
    public positionOptions: Array<KeyValue<string, string>> = [
        {
            key: 'Left Top',
            value: 'left top'
        },
        {
            key: 'Center Top',
            value: 'center top'
        },
        {
            key: 'Right Top',
            value: 'right top'
        },
        {
            key: 'Left Center',
            value: 'left center'
        },
        {
            key: 'Center Center',
            value: 'center center'
        },
        {
            key: 'Right Center',
            value: 'right center'
        },
        {
            key: 'Left Bottom',
            value: 'left bottom'
        },
        {
            key: 'Center Bottom',
            value: 'center bottom'
        },
        {
            key: 'Right Bottom',
            value: 'right bottom'
        }
    ]
    public position: KeyValue<string, string> = this.positionOptions[0];


    public repeatOptions: Array<KeyValue<string, string>> = [
        {
            key: 'Repeat',
            value: 'repeat'
        },
        {
            key: 'Repeat X',
            value: 'repeat-x'
        },
        {
            key: 'Repeat Y',
            value: 'repeat-y'
        },
        {
            key: 'No Repeat',
            value: 'no-repeat'
        },
        {
            key: 'Space',
            value: 'space'
        },
        {
            key: 'Round',
            value: 'round'
        }
    ]

    public repeat: KeyValue<string, string> = this.repeatOptions[0];

    public attachmentOptions: Array<KeyValue<string, string>> = [
        {
            key: 'Scroll',
            value: 'scroll'
        },
        {
            key: 'Fixed',
            value: 'fixed'
        },
        {
            key: 'Local',
            value: 'local'
        }
    ]


    public attachment: KeyValue<string, string> = this.attachmentOptions[0];
    

    getData(): BackgroundImage {
        if (!this.src) return null!;
        const backgroundImage = new BackgroundImage();

        backgroundImage.id = this.id;
        backgroundImage.src = this.src;
        backgroundImage.name = this.name;
        backgroundImage.thumbnail = this.thumbnail;
        backgroundImage.position = this.position.key != this.positionOptions[0].key ? { key: this.position.key, value: this.position.value } : null!;
        backgroundImage.repeat = this.repeat;
        backgroundImage.attachment = this.attachment;
        backgroundImage.imageSizeType = this.imageSizeType;

        return backgroundImage;
    }


    setData(backgroundImage: BackgroundImage) {
        if (backgroundImage) {
            super.setData(backgroundImage);
            if (backgroundImage.position && backgroundImage.position.key) this.position = this.positionOptions.find(x => x.key == backgroundImage.position.key)!;
            if (backgroundImage.repeat && backgroundImage.repeat.key) this.repeat = this.repeatOptions.find(x => x.key == backgroundImage.repeat.key)!;
            if (backgroundImage.attachment && backgroundImage.attachment.key) this.attachment = this.attachmentOptions.find(x => x.key == backgroundImage.attachment.key)!;
        }
    }
}