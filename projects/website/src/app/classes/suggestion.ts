import { SafeHtml } from "@angular/platform-browser";
import { Niche } from "./niche";

export interface Suggestion {
    name: string;
    niche: Niche;
    html?: SafeHtml;
}