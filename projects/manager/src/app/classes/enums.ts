export enum ItemSelectType {
    All,
    Top,
    Middle,
    Bottom
}


export enum HierarchyType {
    Checkbox,
    EditableCheckbox

}

export enum WidgetCursorType {
    NotAllowed,
    Allowed
}

export enum WidgetInspectorView {
    None,
    Page,
    Row,
    Column,
    Widget
}

export enum ListUpdateType {
    Add,
    Edit,
    Delete,
    DeletePrompt,
    SelectedItems,
    UnselectedItems,
    CheckboxChange,
    ArrowClicked,
    VerifyAddEdit,
    DoubleClick,
    DuplicatePromptOpen,
    DuplicatePromptClose,
    CaseTypeUpdate
}


export enum ButtonState {
    Normal,
    Hover,
    Active
}


export enum MenuOptionType {
    MenuItem,
    Divider,
    Submenu
}


export enum WidgetHandle {
    TopLeft,
    Top,
    TopRight,
    Right,
    BottomRight,
    Bottom,
    BottomLeft,
    Left
}


export enum CaseType {
    LowerCase,
    CapitalizedCase,
    TitleCase
}


export enum PopupArrowPosition {
    TopLeft,
    TopRight,
    BottomLeft,
    BottomRight
}


export enum SubproductType {
    Component,
    Bonus
}


export enum ImageSize {
    AnySize = 0,
    Thumbnail = 100,
    Small = 200,
    Medium = 500,
    Large = 675
}

export enum BuilderType {
    Product,
    Page,
    Email
}


export enum ImageLocation {
    Product,
    Media,
    PricePoint,
    Component,
    Bonus,
    PageBackground,
    RowBackground,
    ColumnBackground,
    ImageWidget,
    CarouselWidgetBanner,
    TextWidgetBackground,
    ContainerWidgetBackground,
    ButtonWidgetBackground
}