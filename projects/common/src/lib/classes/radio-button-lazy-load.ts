import { ElementRef } from "@angular/core";
import { LazyLoad } from "./lazy-load";


export class RadioButtonLazyLoad extends LazyLoad {
    private currentRadioButtonGroup!: string
    private radioButtonGroup!: Array<ElementRef<HTMLElement>>;


    setFocusToTabElement(tabIndex: number, direction?: number) {
        // If we're entering a radio button group
        if (this.tabElements[tabIndex].nativeElement.id == 'radioButton') {

            // Then set focus to one of the radio buttons in that radio button group
            this.setFocusToRadioButton(tabIndex, direction!);

        } else {
            this.radioButtonGroup = null!;

            // Then set focus to that tab element
            this.setFocus(tabIndex);
        }
    }



    setFocusToRadioButton(tabIndex: number, direction: number) {
        this.radioButtonGroup = new Array<ElementRef<HTMLElement>>();
        this.currentRadioButtonGroup = (this.tabElements[tabIndex].nativeElement.previousElementSibling as HTMLInputElement).name;

        // Create a list of all the radio buttons that belong to the current radio button group
        this.createRadioButtonGroup();

        // Check to see if any radio button in the current radio button group is checked
        let indexOfRadioButton = this.radioButtonGroup.findIndex(x => (x.nativeElement.previousElementSibling as HTMLInputElement).checked);

        // If (NO) radio button in the current radio button group is checked
        if (indexOfRadioButton == -1) {
            // Then set the first radio button of the group or the last radio button of the group to only be allowed the focus when tabbed (depending on direction)
            indexOfRadioButton = direction == 1 ? 0 : this.radioButtonGroup.length - 1;
        }

        // If we tab to a radio button that is checked or if no radio button is checked and we tab to
        // the first radio button of the group or the last radio button of the group (depending on direction)
        if (tabIndex == this.tabElements.indexOf(this.radioButtonGroup[indexOfRadioButton])) {
            // Set focus to that radio button
            this.setFocus(tabIndex);
        }
        // But if we tab to a radio button that is (NOT) checked or if no radio button is checked and it's (NOT)
        // the first radio button of the group or the last radio button of the group (depending on direction)
        else {
            // Skip to the next tab element
            tabIndex = tabIndex! + (1 * direction);
            if (tabIndex > this.tabElements.length - 1) tabIndex = 0;
            if (tabIndex < 0) tabIndex = this.tabElements.length - 1;
            this.getNextTabElement(tabIndex, direction);
        }
    }



    checkForRadioButtonFocus(direction?: number) {

        if (document.activeElement!.id != 'radioButton' && document.activeElement!.nextElementSibling && document.activeElement!.nextElementSibling!.id == 'radioButton') {
            (document.activeElement!.nextElementSibling as HTMLElement).focus();
        }

        // If the tab element that has the focus is a radio button
        if (document.activeElement!.id == 'radioButton' &&
            // And if that radio button doesn't have its radio button group list created
            (!this.radioButtonGroup ||
                // or the radio button group of that radio button is (NOT) the current radio button group
                (document.activeElement!.previousElementSibling as HTMLInputElement).name != this.currentRadioButtonGroup)) {


            this.radioButtonGroup = new Array<ElementRef<HTMLElement>>();
            this.currentRadioButtonGroup = (document.activeElement!.previousElementSibling as HTMLInputElement).name;

            // Create a list of all the radio buttons that belong to the current radio button group
            this.createRadioButtonGroup();


            if (direction != null) {
                this.onRadioButtonArrow(direction);
            }
        }
    }



    createRadioButtonGroup() {
        for (let i = 0; i < this.tabElements.length; i++) {
            // If the tab element is a radio button that belongs to the current radio button group
            if (this.tabElements[i].nativeElement.id == 'radioButton' && (this.tabElements[i].nativeElement.previousElementSibling as HTMLInputElement).name == this.currentRadioButtonGroup) {
                // Add it to the radio button group list
                this.radioButtonGroup.push(this.tabElements[i]);
            }
        }
    }



    onRadioButtonArrow(direction: number) {
        if (this.radioButtonGroup) {
            // Check to see if any radio button has focus
            let radioButtonIndex = this.radioButtonGroup.findIndex(x => x.nativeElement == document.activeElement);

            // If a radio button has focus
            if (radioButtonIndex != -1) {
                // Increment or decrement by one (depending on direction)
                radioButtonIndex = radioButtonIndex + (1 * direction);
                // Make sure we stay in bounds
                if (radioButtonIndex > this.radioButtonGroup.length - 1) radioButtonIndex = 0;
                if (radioButtonIndex < 0) radioButtonIndex = this.radioButtonGroup.length - 1;
                // Set focus to the next radio button in the list
                this.setFocus(this.tabElements.indexOf(this.radioButtonGroup[radioButtonIndex]));
                // And set that radio button as checked
                (this.radioButtonGroup[radioButtonIndex].nativeElement.previousElementSibling as HTMLInputElement).checked = true;
                this.onRadioButtonChange(this.radioButtonGroup[radioButtonIndex]);
            }
        }
    }




    onRadioButtonSpacebar() {
        // Find the radio button that has the focus
        const radioButton = this.radioButtonGroup.find(x => x.nativeElement == document.activeElement);

        if (radioButton) {
            // As long as the radio button is (NOT) already checked
            if (!(radioButton!.nativeElement.previousElementSibling as HTMLInputElement).checked) {
                // Set that radio button as checked
                (radioButton!.nativeElement.previousElementSibling as HTMLInputElement).checked = true;
                this.onRadioButtonChange(radioButton!);
            }
        }
    }




    onSpace(e: KeyboardEvent): void {
        e.preventDefault();
        if (!this.radioButtonGroup) {
            super.onSpace(e);

            this.checkForRadioButtonFocus();

        } else {

            this.checkForRadioButtonFocus();
            this.onRadioButtonSpacebar()
        }
    }


    onArrowUp(e: KeyboardEvent) {
        if (!this.radioButtonGroup) {
            super.onArrowUp(e);
            this.checkForRadioButtonFocus(-1);
        } else {
            this.checkForRadioButtonFocus();
            this.onRadioButtonArrow(-1);
        }
    }


    onArrowDown(e: KeyboardEvent) {
        if (!this.radioButtonGroup) {
            super.onArrowDown(e);
            this.checkForRadioButtonFocus(1);
        } else {
            this.checkForRadioButtonFocus();
            this.onRadioButtonArrow(1);
        }
    }


    onRadioButtonChange(radioButton: ElementRef<HTMLElement>) { }
}