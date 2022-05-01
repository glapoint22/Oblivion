import { DomSanitizer } from "@angular/platform-browser";
import { DataService } from "common";
import { Subscription, Subject, fromEvent, debounceTime } from "rxjs";
import { HierarchyComponent } from "../components/hierarchies/hierarchy/hierarchy.component";
import { MultiColumnListComponent } from "../components/lists/multi-column-list/multi-column-list.component";
import { FiltersService, FiltersType } from "../services/filters/filters.service";
import { MenuOptionType, ListUpdateType } from "./enums";
import { Filter } from "./filter";
import { FilterOption } from "./filter-option";
import { HierarchyItem } from "./hierarchy-item";
import { HierarchyUpdate } from "./hierarchy-update";
import { Item } from "./item";
import { ListOptions } from "./list-options";
import { ListUpdate } from "./list-update";
import { MultiColumnItem } from "./multi-column-item";
import { MultiColumnListUpdate } from "./multi-column-list-update";

export class FiltersManager {
    // private
    public sanitizer!: DomSanitizer;
    public dataService!: DataService;
    private searchInputSubscription!: Subscription;
    private _filtersHierarchyUpdate!: HierarchyUpdate;
    private _filtersSearchUpdate!: MultiColumnListUpdate;
    private editedSearchModeFilters: Array<HierarchyItem> = new Array<HierarchyItem>();

    // Public
    public nameWidth!: string;
    public typeWidth!: string;
    public searchMode!: boolean;
    public addButtonTitle!: string;
    public editButtonTitle!: string;
    public filtersType!: FiltersType;
    public deleteButtonTitle!: string;
    public searchInput!: HTMLInputElement;
    public filtersService?: FiltersService;
    public filtersHierarchy!: HierarchyComponent;
    public filtersSearch!: MultiColumnListComponent;
    public otherFiltersHierarchy!: HierarchyComponent;
    public filters: Array<Filter> = new Array<Filter>();
    public onClose: Subject<void> = new Subject<void>();
    public otherFilters: Array<Filter> = new Array<Filter>();
    public filtersSearchOptions: ListOptions = new ListOptions();
    public filtersHierarchyOptions: ListOptions = new ListOptions();
    public searchList: Array<MultiColumnItem> = new Array<MultiColumnItem>();
    public get filtersHierarchyUpdate(): HierarchyUpdate { return this._filtersHierarchyUpdate; }
    public get filtersSearchUpdate(): MultiColumnListUpdate { return this._filtersSearchUpdate; }
    public set filtersSearchUpdate(filtersSearchUpdate: MultiColumnListUpdate) { this.onFiltersSearchUpdate(filtersSearchUpdate); }
    public set filtersHierarchyUpdate(filtersHierarchyUpdate: HierarchyUpdate) { this.onFiltersHierarchyUpdate(filtersHierarchyUpdate); }


    // ==================================================================( AFTER VIEW INIT )================================================================== \\

    afterViewInit() {
        this.filtersHierarchyOptions = {
            multiselectable: false,
            verifyAddEdit: true,

            // Delete Prompt
            deletePrompt: {
                parentObj: this,
                primaryButton: {
                    name: 'Delete',
                    buttonFunction: this.setDeleteFilter
                },
                secondaryButton: {
                    name: 'Cancel'
                }
            },

            // Duplicate Prompt
            duplicatePrompt: {
                parentObj: this,
                secondaryButton: {
                    name: 'Close'
                }
            },

            // Menu
            menu: {
                parentObj: this,
                menuOptions: [
                    {
                        type: MenuOptionType.MenuItem
                    },
                    {
                        type: MenuOptionType.MenuItem
                    },
                    {
                        type: MenuOptionType.MenuItem,
                        shortcut: 'Ctrl+Alt+R',
                        optionFunction: this.setEditFilter
                    },
                    {
                        type: MenuOptionType.MenuItem,
                        shortcut: 'Delete',
                        optionFunction: this.setDeleteFilter
                    }
                ]
            }
        }


        this.filtersSearchOptions = {
            multiselectable: false,
            verifyAddEdit: true,

            // Delete Prompt
            deletePrompt: {
                parentObj: this,
                primaryButton: {
                    name: 'Delete',
                    buttonFunction: this.setDeleteFilter
                },
                secondaryButton: {
                    name: 'Cancel'
                }
            },

            // Duplicate Prompt
            duplicatePrompt: {
                parentObj: this,
                secondaryButton: {
                    name: 'Close'
                }
            },

            // Menu
            menu: {
                parentObj: this,
                menuOptions: [
                    {
                        type: MenuOptionType.MenuItem,
                        shortcut: 'Ctrl+Alt+R',
                        optionFunction: this.setEditFilter
                    },
                    {
                        type: MenuOptionType.MenuItem,
                        shortcut: 'Delete',
                        optionFunction: this.setDeleteFilter
                    }
                ]
            }
        }
    }



    // ======================================================================( ON OPEN )====================================================================== \\

    onOpen() {
        if (this.filters.length == 0) {
            this.dataService.get<Array<Filter>>('api/Filters')
                .subscribe((filters: Array<Filter>) => {
                    filters.forEach(x => {
                        this.filters.push({
                            id: x.id,
                            name: x.name,
                            hierarchyGroupID: 0,
                            hidden: false,
                            arrowDown: false
                        })

                        this.otherFilters.push({
                            id: x.id,
                            name: x.name,
                            hierarchyGroupID: 0,
                            hidden: false,
                            arrowDown: false
                        })
                    })
                })
        } else {
            this.filtersHierarchy.listManager.collapseHierarchy();
            this.filters.forEach(x => {
                x.selectType = null!;
                x.selected = false;
            })
        }


        this.sortPendingHierarchyItems();
    }



    // ===================================================================( TOGGLE SEARCH )=================================================================== \\

    toggleSearch() {
        this.searchMode = !this.searchMode;

        // If we're toggling to search mode
        if (this.searchMode) {
            this.searchList.splice(0, this.searchList.length);
            window.setTimeout(() => {
                this.searchInput!.focus();
                this.searchInputSubscription = fromEvent(this.searchInput, 'input').pipe(debounceTime(500)).subscribe(() => {
                    if (this.searchInput.value.length > 1) {
                        this.getSearchResults(this.searchInput.value);
                    }
                });
            })

            // If we're toggling back to hierarchy mode
        } else {

            window.setTimeout(() => {

                this.sortPendingHierarchyItems();

                this.searchInputSubscription.unsubscribe();
                const selectedItem = this.filters.filter(x => x.selectType != null || x.selected == true)[0];
                if (selectedItem) {
                    this.filtersHierarchy.listManager.onItemDown(selectedItem);
                }
            })
        }
    }



    // ==================================================================( SET ADD FILTER )=================================================================== \\

    setAddFilter() {
        this.filtersHierarchy.listManager.selectedItem = null!
        this.filtersHierarchy.add();
    }



    // ===============================================================( SET ADD FILTER OPTION )=============================================================== \\

    setAddFilterOption() {
        this.filtersHierarchy.add();
    }



    // ==================================================================( SET EDIT FILTER )================================================================== \\

    setEditFilter() {
        if (!this.searchMode) {
            this.filtersHierarchy.edit();
        } else {
            this.filtersSearch.edit();
        }
    }



    // =================================================================( SET DELETE FILTER )================================================================= \\

    setDeleteFilter() {
        if (!this.searchMode) {
            this.filtersHierarchy.delete();
        } else {
            this.filtersSearch.delete();
        }
    }



    // ============================================================( ON FILTERS HIERARCHY UPDATE )============================================================ \\

    onFiltersHierarchyUpdate(filtersHierarchyUpdate: HierarchyUpdate) {
        this._filtersHierarchyUpdate = filtersHierarchyUpdate;
        if (filtersHierarchyUpdate.type == ListUpdateType.Add) this.onHierarchyFilterAdd(filtersHierarchyUpdate);
        if (filtersHierarchyUpdate.type == ListUpdateType.ArrowClicked) this.onArrowClick(filtersHierarchyUpdate);
        if (filtersHierarchyUpdate.type == ListUpdateType.Edit) this.onHierarchyFilterEdit(filtersHierarchyUpdate);
        if (filtersHierarchyUpdate.type == ListUpdateType.VerifyAddEdit) this.onHierarchyFilterVerify(filtersHierarchyUpdate);
        if (filtersHierarchyUpdate.type == ListUpdateType.SelectedItems) this.onSelectedHierarchyFilter(filtersHierarchyUpdate);
        if (filtersHierarchyUpdate.type == ListUpdateType.Delete) this.onHierarchyFilterDelete(filtersHierarchyUpdate.deletedItems![0]);
        if (filtersHierarchyUpdate.type == ListUpdateType.DeletePrompt) this.onHierarchyFilterDeletePrompt(filtersHierarchyUpdate.deletedItems![0]);
    }



    // =============================================================( ON FILTERS SEARCH UPDATE )============================================================== \\

    onFiltersSearchUpdate(filtersSearchUpdate: MultiColumnListUpdate) {
        this._filtersSearchUpdate = filtersSearchUpdate;
        if (filtersSearchUpdate.type == ListUpdateType.Edit) this.onSearchFilterEdit(filtersSearchUpdate);
        if (filtersSearchUpdate.type == ListUpdateType.VerifyAddEdit) this.onSearchFilterVerify(filtersSearchUpdate);
        if (filtersSearchUpdate.type == ListUpdateType.SelectedItems) this.onSelectedSearchFilter(filtersSearchUpdate);
        if (filtersSearchUpdate.type == ListUpdateType.Delete) this.onSearchFilterDelete(filtersSearchUpdate.deletedMultiColumnItems![0]);
        if (filtersSearchUpdate.type == ListUpdateType.DeletePrompt) this.onSearchFilterDeletePrompt(filtersSearchUpdate.deletedMultiColumnItems![0]);
    }



    // ===========================================================( ON SELECTED HIERARCHY FILTER )============================================================ \\

    onSelectedHierarchyFilter(filtersHierarchyUpdate: HierarchyUpdate) {
        if (filtersHierarchyUpdate.selectedItems![0].hierarchyGroupID == 0) {
            this.addButtonTitle = 'Add Filter Option';
            this.editButtonTitle = 'Edit Filter';
            this.deleteButtonTitle = 'Delete Filter';
            this.filtersHierarchyOptions.menu!.menuOptions[0].name = 'Add Filter';
            this.filtersHierarchyOptions.menu!.menuOptions[0].optionFunction = this.setAddFilter;
            this.filtersHierarchyOptions.menu!.menuOptions[1].hidden = false;
            this.filtersHierarchyOptions.menu!.menuOptions[1].name = 'Add Filter Option';
            this.filtersHierarchyOptions.menu!.menuOptions[1].optionFunction = this.setAddFilterOption;
            this.filtersHierarchyOptions.menu!.menuOptions[2].name = 'Rename Filter';
            this.filtersHierarchyOptions.menu!.menuOptions[3].name = 'Delete Filter';
        }

        if (filtersHierarchyUpdate.selectedItems![0].hierarchyGroupID == 1) {
            this.addButtonTitle = 'Add Filter Option';
            this.editButtonTitle = 'Edit Filter Option';
            this.deleteButtonTitle = 'Delete Filter Option';
            this.filtersHierarchyOptions.menu!.menuOptions[0].name = 'Add Filter Option';
            this.filtersHierarchyOptions.menu!.menuOptions[0].optionFunction = this.setAddFilterOption;
            this.filtersHierarchyOptions.menu!.menuOptions[1].hidden = true;
            this.filtersHierarchyOptions.menu!.menuOptions[2].name = 'Rename Filter Option';
            this.filtersHierarchyOptions.menu!.menuOptions[3].name = 'Delete Filter Option';
        }
    }



    // =============================================================( ON SELECTED SEARCH FILTER )============================================================= \\

    onSelectedSearchFilter(filtersSearchUpdate: MultiColumnListUpdate) {
        this.editButtonTitle = 'Edit ' + (filtersSearchUpdate.selectedMultiColumnItems![0].values[1].name == 'Filter' ? 'Filter' : 'Filter Optiion');
        this.deleteButtonTitle = 'Delete ' + (filtersSearchUpdate.selectedMultiColumnItems![0].values[1].name == 'Filter' ? 'Filter' : 'Filter Optiion');
        this.filtersSearchOptions.menu!.menuOptions[0].name = 'Rename ' + (filtersSearchUpdate.selectedMultiColumnItems![0].values[1].name == 'Filter' ? 'Filter' : 'Filter Optiion');
        this.filtersSearchOptions.menu!.menuOptions[1].name = 'Delete ' + (filtersSearchUpdate.selectedMultiColumnItems![0].values[1].name == 'Filter' ? 'Filter' : 'Filter Optiion');
    }



    // ==============================================================( ON HIERARCHY FILTER ADD )============================================================== \\
    private musky: number = 1000;
    onHierarchyFilterAdd(filtersHierarchyUpdate: HierarchyUpdate) {
        this.musky++;
        // Add Filter
        if (filtersHierarchyUpdate.hierarchyGroupID == 0) {
            // this.dataService.post<number>('api/Filters', {
            //     name: filtersHierarchyUpdate.name
            // }).subscribe((id: number) => {
            this.filters[filtersHierarchyUpdate.index!].id = this.musky; //id;

            // Other Filters
            this.otherFilters.splice(filtersHierarchyUpdate.index!, 0, {
                id: this.filters[filtersHierarchyUpdate.index!].id,
                hierarchyGroupID: this.filters[filtersHierarchyUpdate.index!].hierarchyGroupID,
                name: this.filters[filtersHierarchyUpdate.index!].name
            })
            // });
        }

        // Add Filter Option
        if (filtersHierarchyUpdate.hierarchyGroupID == 1) {
            const indexOfHierarchyItemParent = this.filtersHierarchy.listManager.getIndexOfHierarchyItemParent(this.filters[filtersHierarchyUpdate.index!]);

            // this.dataService.post<number>('api/Filters/Options', {
            //     id: this.filters[indexOfHierarchyItemParent].id,
            //     name: filtersHierarchyUpdate.name
            // }).subscribe((id: number) => {
            this.filters[filtersHierarchyUpdate.index!].id = this.musky;//id;

            // Other Filters
            this.otherFilters.splice(filtersHierarchyUpdate.index!, 0, {
                id: this.filters[filtersHierarchyUpdate.index!].id,
                hierarchyGroupID: this.filters[filtersHierarchyUpdate.index!].hierarchyGroupID,
                name: this.filters[filtersHierarchyUpdate.index!].name,
                hidden: !this.otherFilters[indexOfHierarchyItemParent].arrowDown
            })
            // })
        }

        const addedOtherHierarchyFilter: HierarchyItem = this.otherFilters.find(x => x.id == this.otherFilters[filtersHierarchyUpdate.index!].id && x.hierarchyGroupID == this.otherFilters[filtersHierarchyUpdate.index!].hierarchyGroupID)!;
        this.setOtherHierarchySort(addedOtherHierarchyFilter);
    }



    // =============================================================( SET OTHER HIERARCHY SORT )============================================================== \\

    setOtherHierarchySort(otherHierarchyFilter: HierarchyItem) {
        // As long as the other filters hierarchy sort group is NOT hidden
        if (!otherHierarchyFilter.hidden && this.otherFiltersHierarchy) {

            // Then sort the other filters hierarchy list
            this.otherFiltersHierarchy.listManager.sort(otherHierarchyFilter);

        } else {

            // Make a list of all the filters we edited in this filters hierarchy so that when we go back to the other filters hierarchy we can then sort those filters accordingly
            this.filtersService!.otherEditedFilters.push(otherHierarchyFilter!);
            this.filtersService!.targetFiltersType = this.filtersType == FiltersType.FilterForm ? FiltersType.ProductFilters : FiltersType.FilterForm;
        }
    }



    // =============================================================( SET OTHER HIERARCHY EDIT )============================================================== \\

    setOtherHierarchyEdit<T extends ListUpdate>(update: T, hierarchyGroupID: number) {
        // Find the filter or filter option in the other filters hierarchy list that we just edited in this filters list
        const editedOtherHierarchyFilter: HierarchyItem = this.otherFilters.find(x => x.id == update.id && x.hierarchyGroupID == hierarchyGroupID)!;

        // If the filter or filter option in the other hierarchy list was found
        if (editedOtherHierarchyFilter) {
            // Then update the name of that filter or filter option in the other filters list to the name of the filter or filter option we just edited in this filters list
            editedOtherHierarchyFilter!.name = update.name ? update.name : (update as MultiColumnListUpdate).values![0].name;


            this.setOtherHierarchySort(editedOtherHierarchyFilter);
        }
    }


    // =============================================================( ON HIERARCHY FILTER EDIT )============================================================== \\

    onHierarchyFilterEdit(filtersHierarchyUpdate: HierarchyUpdate) {
        // // Edit Filter
        // if (filtersHierarchyUpdate.hierarchyGroupID == 0) {
        //     this.dataService.put('api/Filters', {
        //         id: filtersHierarchyUpdate.id,
        //         name: filtersHierarchyUpdate.name
        //     }).subscribe();
        // }

        // // Edit Filter Option
        // if (filtersHierarchyUpdate.hierarchyGroupID == 1) {
        //     this.dataService.put('api/Filters/Options', {
        //         id: filtersHierarchyUpdate.id,
        //         name: filtersHierarchyUpdate.name
        //     }).subscribe();
        // }

        this.setOtherHierarchyEdit<HierarchyUpdate>(filtersHierarchyUpdate, filtersHierarchyUpdate.hierarchyGroupID!);
    }



    // ===============================================================( ON SEARCH FILTER EDIT )=============================================================== \\

    onSearchFilterEdit(filtersSearchUpdate: MultiColumnListUpdate) {
        // Edit Filter
        if (filtersSearchUpdate.values![1].name == 'Filter') {
            // this.dataService.put('api/Filters', {
            //     id: filtersSearchUpdate.id,
            //     name: filtersSearchUpdate.values![0].name
            // }).subscribe();

            // Find the filter in the hierarchy list that we just edited in this search list
            let editedSearchModeFilter = this.filters.find(x => x.id == filtersSearchUpdate.id && x.hierarchyGroupID == 0)!;
            // Then update the name of that filter in the hierarchy list to the name of the filter we just edited in the search list
            editedSearchModeFilter.name = filtersSearchUpdate.values![0].name;
            // Now add the filter we just edited in search mode to an edited filters list so that when we go back to hierarchy mode we can then sort the filters hierarchy based on the filters in that edited filters list
            this.editedSearchModeFilters.push(editedSearchModeFilter);

            this.setOtherHierarchyEdit<MultiColumnListUpdate>(filtersSearchUpdate, 0);
        }

        // Edit Filter Option
        if (filtersSearchUpdate.values![1].name == 'Option') {
            // this.dataService.put('api/Filters/Options', {
            //     id: filtersSearchUpdate.id,
            //     name: filtersSearchUpdate.values![0].name
            // }).subscribe();


            // Find the filter option in the hierarchy list that we just edited in this search list
            let editedSearchModeFilterOption = this.filters.find(x => x.id == filtersSearchUpdate.id && x.hierarchyGroupID == 1)!;
            // If the filter option in the hierarchy list was found
            if (editedSearchModeFilterOption) {
                // Then update the name of that filter option in the hierarchy list to the name of the filter option we just edited in the search list
                editedSearchModeFilterOption.name = filtersSearchUpdate.values![0].name;
                // Now add the filter option we just edited in search mode to an edited filters list so that when we go back to hierarchy mode we can then sort the filters hierarchy based on the filter options in that edited filters list
                this.editedSearchModeFilters.push(editedSearchModeFilterOption);
            }

            this.setOtherHierarchyEdit<MultiColumnListUpdate>(filtersSearchUpdate, 1);
        }
    }



    // ============================================================( ON HIERARCHY FILTER VERIFY )============================================================= \\

    onHierarchyFilterVerify(filtersHierarchyUpdate: HierarchyUpdate) {
        let matchFound: boolean = false;

        // If we're verifying a filter
        if (filtersHierarchyUpdate.hierarchyGroupID == 0) {
            // Loop through each filter and check for a duplicate
            this.filters.forEach(x => {
                if (x.hierarchyGroupID == 0) {
                    if (x.name?.toLowerCase() == filtersHierarchyUpdate.name?.toLowerCase()) {
                        matchFound = true;
                    }
                }
            })

            // If no match was found
            if (!matchFound) {
                this.filtersHierarchy.commitAddEdit();

                // If a match was found
            } else {
                this.filtersHierarchyOptions.duplicatePrompt!.title = 'Duplicate Filter';
                this.filtersHierarchyOptions.duplicatePrompt!.message = this.sanitizer.bypassSecurityTrustHtml('A filter with the name <span style="color: #ffba00">\'' + filtersHierarchyUpdate.name + '\'</span> already exists.');
                this.filtersHierarchy.openDuplicatePrompt();
            }
        }

        // If we're verifying a filter option
        if (filtersHierarchyUpdate.hierarchyGroupID == 1) {
            const filterOption = this.filters.find(x => x.id == filtersHierarchyUpdate.id);
            const indexOfParentFilter = this.filtersHierarchy.listManager.getIndexOfHierarchyItemParent(filterOption!);

            // Loop through each filter option of the parent filter and check for a duplicate
            for (let i = indexOfParentFilter + 1; i < this.filters.length; i++) {
                if (this.filters[i].hierarchyGroupID == 0) break;
                if (this.filters[i].name?.toLowerCase() == filtersHierarchyUpdate.name?.toLowerCase()) {
                    matchFound = true;
                }
            }

            // If no match was found
            if (!matchFound) {
                this.filtersHierarchy.commitAddEdit();

                // If a match was found
            } else {
                this.filtersHierarchyOptions.duplicatePrompt!.title = 'Duplicate Filter Option';
                this.filtersHierarchyOptions.duplicatePrompt!.message = this.sanitizer.bypassSecurityTrustHtml('The filter <span style="color: #ffba00">' + this.filters[indexOfParentFilter].name + '</span> already contains a filter option with the name <span style="color: #ffba00">' + filtersHierarchyUpdate.name + '</span>.');
                this.filtersHierarchy.openDuplicatePrompt();
            }
        }
    }



    // ==============================================================( ON SEARCH FILTER VERIFY )============================================================== \\

    onSearchFilterVerify(filtersSearchUpdate: MultiColumnListUpdate) {
        let matchFound: boolean = false;

        // If we're verifying a filter
        if (filtersSearchUpdate.values![1].name == 'Filter') {
            // Loop through each filter and check for a duplicate
            this.filters.forEach(x => {
                if (x.hierarchyGroupID == 0) {
                    if (x.name?.toLowerCase() == filtersSearchUpdate.name?.toLowerCase()) {
                        matchFound = true;
                    }
                }
            })

            // If no match was found
            if (!matchFound) {
                this.filtersSearch.commitAddEdit();

                // If a match was found
            } else {
                this.filtersSearchOptions.duplicatePrompt!.title = 'Duplicate Filter';
                this.filtersSearchOptions.duplicatePrompt!.message = this.sanitizer.bypassSecurityTrustHtml('A filter with the name <span style="color: #ffba00">\'' + filtersSearchUpdate.name + '\'</span> already exists.');
                this.filtersSearch.openDuplicatePrompt();
            }
        }

        // If we're verifying a filter option
        if (filtersSearchUpdate.values![1].name == 'Option') {

            // Query the database to check for a duplicate
            this.dataService.get<{ id: null, name: null, filterId: null }>('api/Filters/CheckDuplicate', [{ key: 'filterOptionId', value: filtersSearchUpdate.id }, { key: 'filterOptionName', value: filtersSearchUpdate.name }])
                .subscribe((item: { id: null, name: null, filterId: null }) => {

                    // If no match was found
                    if (item == null) {
                        this.filtersSearch.commitAddEdit();

                        // If a match was found
                    } else {
                        const filter = this.filters.find(x => x.hierarchyGroupID == 0 && x.id == item.filterId);
                        this.filtersSearchOptions.duplicatePrompt!.title = 'Duplicate Filter Option';
                        this.filtersSearchOptions.duplicatePrompt!.message = this.sanitizer.bypassSecurityTrustHtml('The filter <span style="color: #ffba00">' + filter!.name + '</span> already contains a filter option with the name <span style="color: #ffba00">' + filtersSearchUpdate.name + '</span>.');
                        this.filtersSearch.openDuplicatePrompt();
                    }
                })
        }
    }



    // =========================================================( ON HIERARCHY FILTER DELETE PROMPT )========================================================= \\

    onHierarchyFilterDeletePrompt(deletedItem: HierarchyItem) {
        // If we're deleting a filter
        if (deletedItem.hierarchyGroupID == 0) {
            this.filtersHierarchyOptions.deletePrompt!.title = 'Delete Filter';
            this.filtersHierarchyOptions.deletePrompt!.message = this.sanitizer.bypassSecurityTrustHtml(
                '<div style="margin-bottom: 21px; display: flex">' +
                '<div style="color: #b4b4b4; width: fit-content; padding-right: 4px; flex-shrink: 0;">Filter:</div>' +
                '<div style="color: #ffba00">' + deletedItem.name + '</div>' +
                '</div>' +

                'Are you sure you want to delete the filter listed above and its contents?'
            );
        }

        // If we're deleting a filter option
        if (deletedItem.hierarchyGroupID == 1) {
            this.filtersHierarchyOptions.deletePrompt!.title = 'Delete Filter Option';
            this.filtersHierarchyOptions.deletePrompt!.message = this.sanitizer.bypassSecurityTrustHtml(
                '<div style="margin-bottom: 21px; display: flex">' +
                '<div style="color: #b4b4b4; width: fit-content; padding-right: 4px; flex-shrink: 0;">Filter Option:</div>' +
                '<div style="color: #ffba00">' + deletedItem.name + '</div>' +
                '</div>' +

                ' Are you sure you want to delete the filter option listed above?'
            );
        }
    }



    // ==========================================================( ON SEARCH FILTER DELETE PROMPT )=========================================================== \\

    onSearchFilterDeletePrompt(deletedItem: MultiColumnItem) {
        // If we're deleting a filter
        if (deletedItem.values[1].name == 'Filter') {
            this.filtersSearchOptions.deletePrompt!.title = 'Delete Filter';
            this.filtersSearchOptions.deletePrompt!.message = this.sanitizer.bypassSecurityTrustHtml(

                '<div style="margin-bottom: 21px; display: flex">' +
                '<div style="color: #b4b4b4; width: fit-content; padding-right: 4px; flex-shrink: 0;">Filter:</div>' +
                '<div style="color: #ffba00">' + deletedItem.values[0].name + '</div>' +
                '</div>' +

                'Are you sure you want to delete the filter listed above and its contents?'
            );
        }

        // If we're deleting a filter option
        if (deletedItem.values[1].name == 'Option') {
            this.filtersSearchOptions.deletePrompt!.title = 'Delete Filter Option';
            this.filtersSearchOptions.deletePrompt!.message = this.sanitizer.bypassSecurityTrustHtml(

                '<div style="margin-bottom: 21px; display: flex">' +
                '<div style="color: #b4b4b4; width: fit-content; padding-right: 4px; flex-shrink: 0;">Filter Option:</div>' +
                '<div style="color: #ffba00">' + deletedItem.values[0].name + '</div>' +
                '</div>' +

                ' Are you sure you want to delete the filter option listed above?'
            );
        }
    }



    // ============================================================( ON HIERARCHY FILTER DELETE )============================================================= \\

    onHierarchyFilterDelete(deletedItem: HierarchyItem) {
        // If we're deleting a filter
        if (deletedItem.hierarchyGroupID == 0) {
            // this.dataService.delete('api/Filters', {
            //     id: deletedItem.id
            // }).subscribe();
        }

        // If we're deleting a filter option
        if (deletedItem.hierarchyGroupID == 1) {
            // this.dataService.delete('api/Filters/Options', {
            //     id: deletedItem.id
            // }).subscribe();
        }


        // Find the index of the filter or filter option in the other filters hierarchy list that we just deleted in this filters list
        const index: number = this.otherFilters.findIndex(x => x.id == deletedItem.id && x.hierarchyGroupID == deletedItem.hierarchyGroupID)!;
        // Delete the filter in the other filters hierarchy
        this.otherFilters.splice(index, 1);
    }



    // ==============================================================( ON SEARCH FILTER DELETE )============================================================== \\

    onSearchFilterDelete(deletedItem: MultiColumnItem) {
        // If we're deleting a filter
        if (deletedItem.values[1].name == 'Filter') {
            // this.dataService.delete('api/Filters', {
            //     id: deletedItem.id
            // }).subscribe();

            const filterIndex = this.filters.findIndex(x => x.id == deletedItem.id && x.hierarchyGroupID == 0);
            this.filters.splice(filterIndex, 1);

            const otherFilterIndex = this.otherFilters.findIndex(x => x.id == deletedItem.id && x.hierarchyGroupID == 0);
            this.otherFilters.splice(otherFilterIndex, 1);
        }

        // If we're deleting a filter option
        if (deletedItem.values[1].name == 'Option') {
            // this.dataService.delete('api/Filters/Options', {
            //     id: deletedItem.id
            // }).subscribe();

            const filterIndex = this.filters.findIndex(x => x.id == deletedItem.id && x.hierarchyGroupID == 1);
            if (filterIndex != -1) this.filters.splice(filterIndex, 1);

            const otherFilterIndex = this.otherFilters.findIndex(x => x.id == deletedItem.id && x.hierarchyGroupID == 1);
            if(otherFilterIndex != -1) this.otherFilters.splice(otherFilterIndex, 1);
        }
    }



    // ==================================================================( ON ARROW CLICK )=================================================================== \\

    onArrowClick(filtersHierarchyUpdate: HierarchyUpdate) {
        // If a filter was expanded and its children hasn't been loaded yet
        if (filtersHierarchyUpdate.arrowDown && !filtersHierarchyUpdate.hasChildren) {
            this.dataService.get<Array<Item>>('api/Filters/Options', [{ key: 'filterId', value: filtersHierarchyUpdate.id }])
                .subscribe((filterOptions: Array<Item>) => {
                    let num = this.filtersHierarchy.listManager.editedItem ? 2 : 1;

                    for (let i = filterOptions.length - 1; i >= 0; i--) {
                        this.filters.splice(filtersHierarchyUpdate.index! + num, 0,
                            {
                                id: filterOptions[i].id,
                                name: filterOptions[i].name,
                                hierarchyGroupID: 1,
                                hidden: false,
                                arrowDown: false,
                                isParent: false
                            }
                        )

                        // Other filters
                        this.otherFilters.splice(filtersHierarchyUpdate.index! + 1, 0,
                            {
                                id: filterOptions[i].id,
                                name: filterOptions[i].name,
                                hierarchyGroupID: 1,
                                arrowDown: false,
                                isParent: false,
                                hidden: !this.otherFilters[filtersHierarchyUpdate.index!].arrowDown,
                            }
                        )
                    }
                })
        } else if (filtersHierarchyUpdate.arrowDown && filtersHierarchyUpdate.hasChildren) {


            let checkForIdentity = (filtersHierarchyUpdate: HierarchyUpdate) => {
                if (!this.filters[filtersHierarchyUpdate.index! + 1].identity) {
                    window.setTimeout(() => {
                        checkForIdentity(filtersHierarchyUpdate);
                    })
                } else {
                    this.sortPendingHierarchyItems();
                }
            }
            checkForIdentity(filtersHierarchyUpdate);
        }
    }




    // ==============================================================( ON SEARCH INPUT CHANGE )=============================================================== \\

    onSearchInputChange(searchInput: any) {
        if (searchInput.value.length == 1) {
            this.getSearchResults(searchInput.value);
        } else if (searchInput.value.length == 0) {
            this.searchList.splice(0, this.searchList.length);
        }
    }



    // ================================================================( GET SEARCH RESULTS )================================================================= \\

    getSearchResults(value: string) {
        this.searchList.splice(0, this.searchList.length);

        this.dataService.get<Array<MultiColumnItem>>('api/Filters/Search', [{ key: 'searchWords', value: value }])
            .subscribe((searchList: Array<MultiColumnItem>) => {

                searchList.forEach(x => {
                    this.searchList.push({

                        id: x.id,
                        values: [{ name: x.name!, width: this.nameWidth, allowEdit: true }, { name: 'Filter', width: this.typeWidth }]
                    })
                })
            });


        this.dataService.get<Array<MultiColumnItem>>('api/Filters/Options/Search', [{ key: 'searchWords', value: value }])
            .subscribe((searchList: Array<MultiColumnItem>) => {

                searchList.forEach(x => {
                    this.searchList.push({

                        id: x.id,
                        values: [{ name: x.name!, width: this.nameWidth, allowEdit: true }, { name: 'Option', width: this.typeWidth }]
                    })
                })
            });
    }



    // ===========================================================( SORT PENDING HIERARCHY ITEMS )============================================================ \\

    sortPendingHierarchyItems() {
        // If a filter was edited in search mode
        if (this.editedSearchModeFilters.length > 0) {
            // Then we need to sort those filters in hierarchy mode
            this.editedSearchModeFilters.forEach(x => {
                if (!x.hidden) {
                    this.filtersHierarchy.listManager.sort(x);
                    const index = this.editedSearchModeFilters.indexOf(x);
                    this.editedSearchModeFilters.splice(index, 1);
                }
            })
        }

        // But if filters were added or edited from another filters list whether it was done in search mode or hierarchy mode
        if (this.filtersService!.otherEditedFilters.length > 0 &&
            this.filtersService!.targetFiltersType == this.filtersType) {

            // Then we need to sort those filters in this hierarchy filter list
            this.filtersService!.otherEditedFilters.forEach(x => {
                if (!x.hidden) {
                    this.filtersHierarchy.listManager.sort(x);
                    const index = this.filtersService!.otherEditedFilters.indexOf(x);
                    this.filtersService!.otherEditedFilters.splice(index, 1);
                }
            })
        }
    }



    // ====================================================================( IS DISABLED )==================================================================== \\

    isDisabled(disabledUpdateProperty: keyof HierarchyUpdate | keyof MultiColumnListUpdate): boolean {
        // If we're in hierarchy mode
        if (!this.searchMode) {

            // As long as filters hierarchy update is not null
            if (this.filtersHierarchyUpdate) {
                // Update it
                let filtersHierarchyDisabledUpdateProperty = disabledUpdateProperty as keyof HierarchyUpdate;
                return this.filtersHierarchyUpdate[filtersHierarchyDisabledUpdateProperty] as boolean;
            }

            // If we're in search mode
        } else if (this.searchMode && this.searchList.length > 0) {

            // As long as filters search update is not null
            if (this.filtersSearchUpdate) {
                // Update it
                let filtersSearchDisabledUpdateProperty = disabledUpdateProperty as keyof MultiColumnListUpdate;
                return this.filtersSearchUpdate[filtersSearchDisabledUpdateProperty] as boolean;
            }
        }
        // Otherwise, set as disabled
        return true;
    }



    // =====================================================================( ON ESCAPE )===================================================================== \\

    onEscape(): void {
        if (
            // Filters Hierarchy
            (!this.searchMode &&
                this.filtersHierarchy.listManager.selectedItem == null &&
                this.filtersHierarchy.listManager.editedItem == null &&
                !this.filtersHierarchy.listManager.promptOpen)

            ||

            // Filters Search No Results
            (this.searchMode && this.searchList.length == 0)

            ||

            // Filters Search With Results
            (this.searchMode && this.searchList.length > 0 &&
                this.filtersSearch.listManager.selectedItem == null &&
                this.filtersSearch.listManager.editedItem == null &&
                !this.filtersSearch.listManager.promptOpen))

            this.onClose.next();
    }
}