import { Font } from "./font";
import { Selection } from "./selection";

export class FontSize extends Font {

    constructor(selection: Selection) {
        
        super(selection);

        this.name = 'font-size';
        this.options = [
            {
                key: '6',
                value: '6px'
            },
            {
                key: '8',
                value: '8px'
            },
            {
                key: '9',
                value: '9px'
            },
            {
                key: '10',
                value: '10px'
            },
            {
                key: '11',
                value: '11px'
            },
            {
                key: '12',
                value: '12px'
            },
            {
                key: '14',
                value: '14px'
            },
            {
                key: '18',
                value: '18px'
            },
            {
                key: '24',
                value: '24px'
            },
            {
                key: '30',
                value: '30px'
            },
            {
                key: '36',
                value: '36px'
            },
            {
                key: '48',
                value: '48px'
            },
            {
                key: '60',
                value: '60px'
            },
            {
                key: '72',
                value: '72px'
            },
        ]

        this.defaultOption = this.selectedOption = this.options[6];
    }
}