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
    DoubleClick
}


export enum ButtonState {
    Normal,
    Hover,
    Active
}


export enum MenuOptionType {
    MenuItem,
    Divider
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