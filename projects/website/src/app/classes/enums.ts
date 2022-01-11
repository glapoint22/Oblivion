export enum ExternalLoginProvidersFormType {
    SignUp,
    LogIn
}

export enum ShareListType {
    Share,
    Collaborate,
    Both
}

export enum ShippingType {
    None,
    FreeShipping,
    FreeUsShipping,
    PlusShipping,
    JustPayShipping
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


export enum MediaType {
    Image,
    Video,
}

export enum ReviewFilter {
    AllStars = 'all-stars',
    FiveStars = 'five-stars',
    FourStars = 'four-stars',
    ThreeStars = 'three-stars',
    TwoStars = 'two-stars',
    OneStar = 'one-star'
}


export enum VideoType {
    YouTube,
    Vimeo,
    Wistia
}


export enum QueryType {
    None,
    Category,
    Niche,
    ProductSubgroup,
    FeaturedProducts,
    ProductPrice,
    ProductRating,
    ProductKeywords,
    ProductCreationDate,
    SubQuery,
    Auto
}


export enum ComparisonOperatorType {
    Equal = 1,
    NotEqual,
    GreaterThan,
    GreaterThanOrEqual,
    LessThan,
    LessThanOrEqual
}


export enum LogicalOperatorType {
    And = 1,
    Or
}