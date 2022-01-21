export class CircleOverlay {
    private picContainer!: HTMLElement;
    private pic!: HTMLElement;


    public left!: number;
    public top!: number;
    public bottom!: number;
    public right!: number;
    public percentLeft!: number;
    public percentCenter!: number;
    public percentRight!: number;
    public percentTop!: number;
    public percentMiddle!: number;
    public percentBottom!: number;
    public diameter!: number;

    set(picContainer: HTMLElement, pic: HTMLElement) {
        this.picContainer = picContainer;
        this.pic = pic;
        this.percentLeft = this.getPercentLeft();
        this.percentCenter = this.getPercentCenter();
        this.percentRight = this.getPercentRight();
        this.percentTop = this.getPercentTop();
        this.percentMiddle = this.getPercentMiddle();
        this.percentBottom = this.getPercentBottom();

        // Set the circle overlay boundarys
        this.left = (this.picContainer.offsetWidth / 2) - (this.diameter / 2);
        this.top = (this.picContainer.offsetHeight / 2) - (this.diameter / 2);
        this.right = this.left + this.diameter;
        this.bottom = this.top + this.diameter;
    }


    getPercentLeft(): number {
        const picContainerCenter = this.picContainer.offsetWidth / 2;
        const circleRadius = this.diameter / 2;
        const circleLeft = picContainerCenter - circleRadius;
        const distanceBetweenPicLeftAndCircleLeft = circleLeft - this.pic.offsetLeft;
        const circlePercentLeft = distanceBetweenPicLeftAndCircleLeft / this.pic.offsetWidth;
        return circlePercentLeft;
    }


    getPercentCenter(): number {
        const picContainerCenter = this.picContainer.offsetWidth / 2;
        const distanceBetweenPicLeftAndCircleCenter = picContainerCenter - this.pic.offsetLeft;
        const circlePercentCenter = distanceBetweenPicLeftAndCircleCenter / this.pic.offsetWidth;
        return circlePercentCenter
    }

    getPercentRight(): number {
        const picContainerCenter = this.picContainer.offsetWidth / 2;
        const circleRadius = this.diameter / 2;
        const circleRight = picContainerCenter + circleRadius;
        const distanceBetweenPicLeftAndCircleRight = circleRight - this.pic.offsetLeft;
        const circlePercentRight = distanceBetweenPicLeftAndCircleRight / this.pic.offsetWidth;
        return circlePercentRight;
    }





    getPercentTop(): number {
        const picContainerMiddle = this.picContainer.offsetHeight / 2;
        const circleRadius = this.diameter / 2;
        const circleTop = picContainerMiddle - circleRadius;
        const distanceBetweenPicTopAndCircleTop = circleTop - this.pic.offsetTop;
        const circlePercentTop = distanceBetweenPicTopAndCircleTop / this.pic.offsetHeight;
        return circlePercentTop;
    }


    getPercentMiddle(): number {
        const picContainerMiddle = this.picContainer.offsetHeight / 2;
        const distanceBetweenPicTopAndCircleMiddle = picContainerMiddle - this.pic.offsetTop;
        const circlePercentMiddle = distanceBetweenPicTopAndCircleMiddle / this.pic.offsetHeight;
        return circlePercentMiddle
    }


    getPercentBottom(): number {
        const picContainerMiddle = this.picContainer.offsetHeight / 2;
        const circleRadius = this.diameter / 2;
        const circleBottom = picContainerMiddle + circleRadius;
        const distanceBetweenPicTopAndCircleBottom = circleBottom - this.pic.offsetTop;
        const circlePercentBottom = distanceBetweenPicTopAndCircleBottom / this.pic.offsetHeight;
        return circlePercentBottom;
    }


    getDiameter(picContainer: HTMLElement, circleOverlay: HTMLElement): number {
        let circleOverlayDiameter: number;

        // If the height of the pic container is less than its width
        if (picContainer.offsetHeight < picContainer.offsetWidth) {
            // And if its height is less than 300
            if (picContainer.offsetHeight < 300) {
                // Set the diameter of the circle overlay to the height of the pic container
                circleOverlayDiameter = picContainer.offsetHeight;

                // But if the height of the pic container is 300 or more
            } else {
                // Set the diameter of the circle overlay to 300
                circleOverlayDiameter = 300;
            }

            // Or if the width of the pic container is less than its height
        } else {

            // And if its width is less than 300
            if (picContainer.offsetWidth < 300) {
                // Set the diameter of the circle overlay to the width of the pic container
                circleOverlayDiameter = picContainer.offsetWidth;

                // But if the width of the pic container is 300 or more
            } else {
                // Set the diameter of the circle overlay to 300
                circleOverlayDiameter = 300;
            }
        }


        // Set the circle overlay size
        circleOverlay.style.maxWidth = circleOverlayDiameter + "px";
        circleOverlay.style.maxHeight = circleOverlayDiameter + "px";


        return circleOverlayDiameter;
    }
}