export enum QueryType {
    None,
    Category,
    Niche,
    Subgroup,
    Price,
    Rating,
    KeywordGroup,
    Date,
    Auto
}


export enum ComparisonOperatorType {
    Equal,
    NotEqual,
    GreaterThan,
    GreaterThanOrEqual,
    LessThan,
    LessThanOrEqual
}


export enum LogicalOperatorType {
    And,
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


export enum AutoQueryType {
    Browsed,
    Related,
    RelatedBrowsed,
    RelatedBought,
    RelatedWishlist
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