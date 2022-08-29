import { Image, Video } from "common";
import { Background } from "./background";
import { BackgroundImage } from "./background-image";
import { Caption } from "./caption";
import { ColumnSpan } from "./column-span";
import { Row } from "./row";

export class PageContent {
    public background: Background = new Background();
    public rows: Array<Row> = new Array<Row>();

    toString(): string {
        return JSON.stringify(this, (key, value) => {
            if (
                (typeof value != 'number' && !value) ||
                (typeof value == 'object' && Object.values(value).length == 0) ||
                (value instanceof Background && !value.enabled) ||
                (value instanceof ColumnSpan && value.values.length == 1 && value.values[0].span == 12)
            ) {
                return undefined;
            }

            // Background Image
            else if (value instanceof BackgroundImage) {
                if (value.id) {
                    return {
                        id: value.id,
                        imageSizeType: value.imageSizeType,
                        position: value.position,
                        repeat: value.repeat,
                        attachment: value.attachment
                    }
                } else {
                    return undefined;
                }

            }

            // Image
            else if (value instanceof Image) {
                return {
                    id: value.id,
                    imageSizeType: value.imageSizeType,
                }
            }

            // Video
            else if (value instanceof Video) {
                return {
                    id: value.id
                }
            }

            // Caption
            else if (value instanceof Caption) {
                return {
                    font: value.font,
                    fontSize: value.fontSize,
                    fontWeight: value.fontWeight,
                    fontStyle: value.fontStyle,
                    textDecoration: value.textDecoration,
                    text: value.text,
                    color: value.color
                }
            }

            // Other
            else {
                return value;
            }
        });
    }



    setData(pageContent: PageContent) {
        if (pageContent) {
            if (pageContent.background) this.background.setData(pageContent.background);
            if (pageContent.rows) this.rows = pageContent.rows;
        }
    }
}