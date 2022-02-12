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

export enum BreakpointType {
    PaddingTop = 1,
    PaddingRight,
    PaddingBottom,
    PaddingLeft,
    HorizontalAlignment,
    VerticalAlignment,
    Visibility,
    ColumnSpan
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


export enum VerticalAlign {
    Top = 'flex-start',
    Middle = 'center',
    Bottom = 'flex-end'
}


export enum HorizontalAlign {
    Left = 'left',
    Center = 'center',
    Right = 'right'
}