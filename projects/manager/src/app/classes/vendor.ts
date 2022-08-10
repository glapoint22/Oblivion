import { Item } from "./item";

export class Vendor extends Item {
    webPage?: string;
    street?: string;
    city?: string;
    zip?: number;
    poBox?: number;
    state?: string;
    country?: string;
    primaryFirstName?: string;
    primaryLastName?: string;
    primaryOfficePhone?: string;
    primaryMobilePhone?: string;
    primaryEmail?: string;
    secondaryFirstName?: string;
    secondaryLastName?: string;
    secondaryOfficePhone?: string;
    secondaryMobilePhone?: string;
    secondaryEmail?: string;
    notes?: string;
}