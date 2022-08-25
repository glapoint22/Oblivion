import { WidgetType } from "widgets";
import { BuilderType, WidgetCursorType } from "./enums";

export class WidgetCursor {
    private canvas!: HTMLCanvasElement;
    private ctx!: CanvasRenderingContext2D;

    constructor
        (
            public name: string,
            public widgetType: WidgetType,
            public className: string,
            public unicode: string,
            public fontSize: string,
            public y: number,
            public x: number,
    ) {
        this.canvas = document.createElement("canvas");
        this.canvas.width = 32;
        this.canvas.height = 32;
        this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    }


    // ---------------------------------------------------------------Get Cursor------------------------------------------------
    public getCursor(widgetCursorType: WidgetCursorType = WidgetCursorType.NotAllowed): string {
        // Clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Font size
        this.ctx.font = this.fontSize + ' fontawesome';

        // Background
        this.ctx.fillStyle = widgetCursorType == WidgetCursorType.Allowed ? '#1898e382' : '#e3181882';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Stroke
        this.ctx.strokeStyle = widgetCursorType == WidgetCursorType.Allowed ? '#0a9bef' : '#ef0a0a';
        this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);

        // Icon
        this.ctx.fillStyle = widgetCursorType == WidgetCursorType.Allowed ? '#0d8af5' : '#f50d0d';
        this.ctx.fillText(this.unicode, this.x, this.y);

        // Arrow
        this.ctx.fillStyle = '#e9e9e9';
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(10, 0);
        this.ctx.lineTo(0, 10);
        this.ctx.fill();

        return 'url(' + this.canvas.toDataURL() + '), auto';
    }











    // ---------------------------------------------------------------Get Widget Cursors------------------------------------------------
    public static getWidgetCursors(builderType: BuilderType): Array<WidgetCursor> {
        const widgetCursors: Array<WidgetCursor> = [];

        // Text
        widgetCursors.push(new WidgetCursor(
            'Text',
            WidgetType.Text,
            'fa-solid fa-align-left',
            '\uf036',
            '24px',
            25,
            6));




        // Container
        widgetCursors.push(new WidgetCursor(
            'Container',
            WidgetType.Container,
            'fa-solid fa-box-open',
            '\uf49e',
            '24px',
            25,
            1));





        // Image
        widgetCursors.push(new WidgetCursor(
            'Image',
            WidgetType.Image,
            'fa-solid fa-image',
            '\uf03e',
            '26px',
            26,
            3));








        // Button
        widgetCursors.push(new WidgetCursor(
            'Button',
            WidgetType.Button,
            'fa-solid fa-stop',
            '\uf04d',
            '32px',
            28,
            4));







        // Line
        widgetCursors.push(new WidgetCursor(
            'Line',
            WidgetType.Line,
            'fa-solid fa-slash',
            '\uf715',
            '22px',
            24,
            1));





        if (builderType == BuilderType.Page) {
            // Video
            widgetCursors.push(new WidgetCursor(
                'Video',
                WidgetType.Video,
                'fa-solid fa-film',
                '\uf008',
                '24px',
                25,
                4));






            // Product Slider
            widgetCursors.push(new WidgetCursor(
                'Product Slider',
                WidgetType.ProductSlider,
                'fa-brands fa-product-hunt',
                '\uf288',
                '24px',
                25,
                4));








            // Carousel
            widgetCursors.push(new WidgetCursor(
                'Carousel',
                WidgetType.Carousel,
                'fa-solid fa-rotate',
                '\uf2f1',
                '25px',
                25,
                4));







            // Grid
            widgetCursors.push(new WidgetCursor(
                'Grid',
                WidgetType.Grid,
                'fa-solid fa-table-cells-large',
                '\uf009',
                '24px',
                25,
                4));
        }




        return widgetCursors;
    }
}