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



export enum WidgetType {
    Button = 1,
    Text,
    Image,
    Container,
    Line,
    Video,
    ProductSlider,
    Shop,
    Carousel,
    Grid
}




export enum VerticalAlignmentType {
    Top,
    Middle,
    Bottom
}


export enum HorizontalAlignmentType {
    Left,
    Center,
    Right
}


export enum PaddingType {
    Top,
    Right,
    Bottom,
    Left
}

export enum PageType {
    Custom,
    Home,
    Browse,
    Search,
    Grid
}


export enum BreakpointType {
    mic,
    xxs,
    xs,
    sm,
    md,
    lg,
    xl,
    xxl,
    hd
}