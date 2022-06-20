import { KeyValue } from "@angular/common";
import { Image } from "common";

export class BackgroundImage extends Image {
    // public position!: string;
    // public repeat!: string;
    // public attachment!: string;

    public _positionOptions: Array<KeyValue<string, string>> = [
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
    public get positionOptions(): Array<KeyValue<string, string>> {
        return this._positionOptions;
    }
    public position: KeyValue<string, string> = this.positionOptions[0];


    private _repeatOptions: Array<KeyValue<string, string>> = [
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
    public get repeatOptions(): Array<KeyValue<string, string>> {
        return this._repeatOptions;
    }


    public repeat: KeyValue<string, string> = this.repeatOptions[0];






    private _attachmentOptions: Array<KeyValue<string, string>> = [
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
    public get attachmentOptions(): Array<KeyValue<string, string>> {
        return this._attachmentOptions;
    }


    public attachment: KeyValue<string, string> = this.attachmentOptions[0];






    constructor() {
        super();

        Object.defineProperty(
            this,
            '_positionOptions',
            {
                enumerable: false
            }
        );


        Object.defineProperty(
            this,
            '_repeatOptions',
            {
                enumerable: false
            }
        );


        Object.defineProperty(
            this,
            '_attachmentOptions',
            {
                enumerable: false
            }
        );

        Object.assign(this);
    }

    getData(): BackgroundImage {
        if (!this.src) return null!;
        const backgroundImage = new BackgroundImage();

        backgroundImage.src = this.src;
        backgroundImage.name = this.name;
        backgroundImage.thumbnail = this.thumbnail;
        backgroundImage.position = this.position.key != this.positionOptions[0].key ? { key: this.position.key, value: this.position.value } : null!;
        backgroundImage.repeat = this.repeat;
        backgroundImage.attachment = this.attachment;

        return backgroundImage;
    }


    setData(backgroundImage: BackgroundImage) {
        if (backgroundImage) {
            super.setData(backgroundImage);
            if (backgroundImage.position.key) this.position = this.positionOptions.find(x => x.key == backgroundImage.position.key)!;
            if (backgroundImage.repeat.key) this.repeat = this.repeatOptions.find(x => x.key == backgroundImage.repeat.key)!;
            if (backgroundImage.attachment.key) this.attachment = this.attachmentOptions.find(x => x.key == backgroundImage.attachment.key)!;
        }
    }
}