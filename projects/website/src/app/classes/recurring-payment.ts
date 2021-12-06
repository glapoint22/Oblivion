import { RebillFrequency } from "./enums";

export class RecurringPayment {
    public trialPeriod: number = 0;
    public price: number = 0;
    public rebillFrequency: RebillFrequency = RebillFrequency.None;
    public timeFrameBetweenRebill: number = 0;
    public subscriptionDuration: number = 0;
}