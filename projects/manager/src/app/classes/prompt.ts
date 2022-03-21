import { Button } from "./button";

export class Prompt {
    parentObj!: Object;
    title!: string;
    message?: string;
    primaryButton?: Button;
    secondaryButton?: Button;
    tertiaryButton?: Button;
}