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
    CaseTypeUpdate,
    MultiItemAdd
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
    ActivateAccountOneTimePassword,
    ForgotPasswordOneTimePassword,
    NameUpdated,
    UpdateEmailOneTimePassword,
    EmailUpdated,
    PasswordUpdated,
    ProfileImageUpdated,
    CollaboratorJoinedList,
    UserJoinedList,
    UserRemovedFromList,
    CollaboratorRemovedFromList,
    UserRemovedCollaborator,
    CollaboratorAddedListItem,
    UserAddedListItem,
    CollaboratorRemovedListItem,
    UserRemovedListItem,
    CollaboratorMovedListItem,
    UserMovedListItem,
    CollaboratorUpdatedList,
    UserUpdatedList,
    CollaboratorDeletedList,
    UserDeletedList,
    ItemReviewed,
    DeleteAccountOneTimePassword,
    AccountDeleted,
    WelcomeToNicheShack,
    NoncompliantStrikeList,
    NoncompliantStrikeUserImage,
    NoncompliantStrikeUserName,
    NoncompliantStrikeReview,
    UserAccountTerminated,
    MessageReply
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


export enum ReformListOption {
    ReplaceName,
    RemoveDescription,
    ReplaceNameandRemoveDescription
}


export enum PublishStatus {
    New,
    Modified
}