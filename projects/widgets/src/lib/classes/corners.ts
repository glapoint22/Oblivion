export class Corners {
    public constrain: boolean = true;
    public topLeft: number = 0;
    public topRight: number = 0;
    public bottomLeft: number = 0;
    public bottomRight: number = 0;

    setData(corners: Corners) {
        if (corners) {
            if (corners.constrain) this.constrain = corners.constrain;
            if (corners.topLeft) this.topLeft = corners.topLeft;
            if (corners.topRight) this.topRight = corners.topRight;
            if (corners.bottomLeft) this.bottomLeft = corners.bottomLeft;
            if (corners.bottomRight) this.bottomRight = corners.bottomRight;
        }
    }


    getData(): Corners {
        if (this.topLeft == 0 && this.topRight == 0 && this.bottomLeft == 0 && this.bottomRight == 0) return null!;
        const corners = new Corners();

        corners.constrain = this.constrain;
        corners.topLeft = this.topLeft;
        corners.topRight = this.topRight;
        corners.bottomLeft = this.bottomLeft;
        corners.bottomRight = this.bottomRight;

        return corners;
    }
}