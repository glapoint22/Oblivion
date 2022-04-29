import { HSL } from "./hsl";

export class HSB {
    constructor(public h: number, public s: number, public b: number) { }

    toHSL(): HSL {
        // determine the lightness in the range [0,100]
        let l = (2 - this.s / 100) * this.b / 2;
        let hsl = new HSL(this.h, this.s * this.b / (l < 50 ? l * 2 : 200 - l * 2), l);

        // correct a division-by-zero error
        if (isNaN(hsl.s)) hsl.s = 0;
        return hsl;
    }
}