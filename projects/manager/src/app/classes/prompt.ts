import { SafeHtml } from "@angular/platform-browser";
import { Button } from "./button";

export class Prompt {
    parentObj!: Object;
    title?: string;
    message?: SafeHtml;
    primaryButton?: Button;
    secondaryButton?: Button;
    tertiaryButton?: Button;
}