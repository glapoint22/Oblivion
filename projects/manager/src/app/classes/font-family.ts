import { Font } from "./font";
import { Text } from "./text";

export class FontFamily extends Font {

    constructor(text: Text) {

        super(text);

        this.name = 'font-family';
        this.options = [
            {
                key: 'Arial',
                value: 'Arial, Helvetica, sans-serif'
            },
            {
                key: 'Arial Black',
                value: '"Arial Black", Gadget, sans-serif'
            },
            {
                key: 'Book Antiqua',
                value: '"Book Antiqua", "Palatino Linotype", Palatino, serif'
            },
            {
                key: 'Comic Sans MS',
                value: '"Comic Sans MS", cursive, sans-serif'
            },
            {
                key: 'Courier New',
                value: '"Courier New", Courier, monospace'
            },
            {
                key: 'Georgia',
                value: 'Georgia, serif'
            },
            {
                key: 'Impact',
                value: 'Impact, Charcoal, sans-serif'
            },
            {
                key: 'Lucida Console',
                value: '"Lucida Console", Monaco, monospace'
            },
            {
                key: 'Lucida Sans Unicode',
                value: '"Lucida Sans Unicode", "Lucida Grande", sans-serif'
            },
            {
                key: 'Palatino Linotype',
                value: '"Palatino Linotype", "Book Antiqua", Palatino, serif'
            },
            {
                key: 'Tahoma',
                value: 'Tahoma, Geneva, sans-serif'
            },
            {
                key: 'Times New Roman',
                value: '"Times New Roman", Times, serif'
            },
            {
                key: 'Trebuchet MS',
                value: '"Trebuchet MS", Helvetica, sans-serif'
            },
            {
                key: 'Verdana',
                value: 'Verdana, Geneva, sans-serif'
            }
        ]

        this.defaultOption = this.selectedOption = this.options[0];
    }
}