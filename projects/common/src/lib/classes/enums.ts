export enum ReviewFilter {
    AllStars = 'all-stars',
    FiveStars = 'five-stars',
    FourStars = 'four-stars',
    ThreeStars = 'three-stars',
    TwoStars = 'two-stars',
    OneStar = 'one-star'
}


export enum SpinnerAction {
    None,
    Start,
    End,
    StartEnd
}


export enum MediaType {
    Image,
    Video,
}



export enum VideoType {
    YouTube,
    Vimeo,
    Wistia
}


export enum ShippingType {
    None,
    FreeShipping,
    FreeUsShipping,
    PlusShipping,
    JustPayShipping,
    Value
}


export enum RebillFrequency {
    None,
    Days,
    Weeks,
    Weekly,
    BiWeekly,
    Months,
    Monthly,
    Quarterly,
    Annual
}


export enum ImageSizeType {
    AnySize = 0,
    Thumbnail = 80,
    Small = 200,
    Medium = 500,
    Large = 675
}



export enum NotificationType {
    UserName,
    UserImage,
    List,
    Review,
    Message,
    ReviewComplaint,
    ProductNameDoesNotMatchWithProductDescription,
    ProductNameDoesNotMatchWithProductImage,
    ProductNameOther,
    ProductPriceTooHigh,
    ProductPriceNotCorrect,
    ProductPriceOther,
    VideosAndImagesAreDifferentFromProduct,
    NotEnoughVideosAndImages,
    VideosAndImagesNotClear,
    VideosAndImagesMisleading,
    VideosAndImagesOther,
    ProductDescriptionIncorrect,
    ProductDescriptionTooVague,
    ProductDescriptionMisleading,
    ProductDescriptionOther,
    ProductReportedAsIllegal,
    ProductReportedAsHavingAdultContent,
    OffensiveProductOther,
    ProductInactive,
    ProductSiteNolongerInService,
    MissingProductOther,
    Error
}



export enum DropdownType {
    Website,
    Manager,
    Button
}