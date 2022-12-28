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




export enum MediaBrowserView {
    ImageSelect,
    ImagePreview,
    ImageUpdate,
    VideoSelect,
    VideoPreview,
    VideoUpdate,
    SearchResults
}


export enum MediaBrowserMode {
    New,
    Update,
    Swap
}


export enum BuilderType {
    Product,
    Page,
    Email
}



export enum EmailType {
    None,
    AccountActivation,
    ForgotPassword,
    NameChange,
    EmailChange,
    PasswordChange,
    ProfileImageChange,
    EmailOneTimePassword,
    NewCollaborator,
    RemovedCollaborator,
    CollaboratorRemoved,
    AddedListItem,
    RemovedListItem,
    MovedListItem,
    ListNameChange,
    DeletedList,
    Review,
    DeleteAccount,
    DeleteAccountOneTimePassword,
    WelcomeToNicheShack
}



export enum QueryType {
    None,
    Niche,
    Subniche,
    ProductGroup,
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





export enum AutoQueryType {
    Browsed,
    Related,
    RelatedBrowsed,
    RelatedBought,
    RelatedWishlist
}


export enum QueryElementType {
    QueryRow,
    QueryGroup
}