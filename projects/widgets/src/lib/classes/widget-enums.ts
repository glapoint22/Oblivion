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


export enum LinkOption {
    None,
    Page,
    Product,
    WebAddress,
    OnClick
}


export enum VerticalAlignmentType {
    Top = 'vertical-align-top',
    Middle = 'vertical-align-middle',
    Bottom = 'vertical-align-bottom'
}


export enum HorizontalAlignmentType {
    Left = 'horizontal-align-left',
    Center = 'horizontal-align-center',
    Right = 'horizontal-align-right'
}


export enum PaddingType {
    Top = 'padding-top',
    Right = 'padding-right',
    Bottom = 'padding-bottom',
    Left = 'padding-left'
}

export enum PageType {
    Custom,
    Home,
    Browse,
    Search,
    Grid
}