import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ColumnSpanValue } from 'widgets';
import { WidgetService } from '../../services/widget/widget.service';
import { ColumnDevComponent } from '../column-dev/column-dev.component';
import { NumberFieldComponent } from '../number-field/number-field.component';

@Component({
  selector: 'column-span',
  templateUrl: './column-span.component.html',
  styleUrls: ['./column-span.component.scss']
})
export class ColumnSpanComponent implements OnInit {
  @Input() column!: ColumnDevComponent;
  @Output() onChange: EventEmitter<void> = new EventEmitter();
  @ViewChild('breakpointCheckbox') checkbox!: ElementRef<HTMLInputElement>;
  public columnSpans: Array<number> = new Array<number>(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12);
  public columnSpan!: number;
  public isBreakpointCheckboxChecked: boolean = false;

  constructor(private widgetService: WidgetService) { }



  // ----------------------------------------------------------- Ng On Init -----------------------------------------------------------------
  ngOnInit(): void {
    // Subscribe to breakpoint changes
    this.widgetService.$breakpointChange.subscribe(() => {
      if (this.column.columnSpan.values.length > 0 && this.column.columnSpan.values.some(x => x.breakpoint)) {
        this.setColumnSpan();
      }
    });
  }


  // ----------------------------------------------------------- Ng On Changes -----------------------------------------------------------------
  ngOnChanges(): void {
    this.setColumnSpan();
  }




  // ----------------------------------------------------------- Get Column Span Value Index -----------------------------------------------------------------
  getColumnSpanValueIndex(column: ColumnDevComponent): number {
    // Get the current breakpoint based on the array of column span values
    const breakpoint = this.widgetService.getBreakpoint(column.columnSpan.values.map(x => x.breakpoint as string));

    if (breakpoint) {
      // Find the column span value that has this breakpoint
      return column.columnSpan.values.findIndex(x => x.breakpoint == breakpoint);

    } else {

      // Find any values without a breakpoint
      return this.column.columnSpan.values.findIndex(x => !x.breakpoint);
    }
  }





  // ----------------------------------------------------------- Set Column Span -----------------------------------------------------------------
  setColumnSpan() {
    // Get the current breakpoint based on the array of column span values
    const breakpoint = this.widgetService.getBreakpoint(this.column.columnSpan.values.map(x => x.breakpoint as string));


    if (breakpoint) {
      // Find the column span value that has this breakpoint
      const columnSpanValue = this.column.columnSpan.values.find(x => x.breakpoint == breakpoint);

      // Assign the selected horizontal alignment
      if (columnSpanValue) {
        this.columnSpan = columnSpanValue.span;
        if (this.checkbox) this.checkbox.nativeElement.checked = true;
        this.isBreakpointCheckboxChecked = true;
      }


    } else {
      // Find any values without a breakpoint
      const columnSpanValue = this.column.columnSpan.values.find(x => !x.breakpoint);

      // Assign the selected horizontal alignment
      if (columnSpanValue) {
        this.columnSpan = columnSpanValue.span;
      } else {

        // Nothing found so set the default
        this.columnSpan = 12;
      }


      // Uncheck the checkbox
      if (this.checkbox) this.checkbox.nativeElement.checked = false;
      this.isBreakpointCheckboxChecked = false;
    }
  }



  // ----------------------------------------------------------- On Breakpoint Checkbox Change -----------------------------------------------------------------
  onBreakpointCheckboxChange(breakpointCheckbox: HTMLInputElement) {
    // Checked
    if (breakpointCheckbox.checked) {
      this.column.rowComponent.columns.forEach((column: ColumnDevComponent) => {
        // Find a column span value that does NOT have a breakpoint
        const columnSpanValue = column.columnSpan.values.find(x => x.breakpoint == null);

        // If found, assign the breakpoint value to it
        if (columnSpanValue) {
          columnSpanValue.breakpoint = this.widgetService.currentBreakpoint;

          // Not found, create a new column span value
        } else {
          column.columnSpan.values.push(new ColumnSpanValue(12, this.widgetService.currentBreakpoint));
        }

        column.columnSpan.setClasses(column.columnElement);
      });


      // Not Checked
    } else {
      // Get the current breakpoint and the index of the column span value that's in this breakpoint
      let breakpoint = this.widgetService.getBreakpoint(this.column.columnSpan.values.map(x => x.breakpoint as string));
      let index = this.column.columnSpan.values.findIndex(x => x.breakpoint == breakpoint);

      // Loop through each colunm and remove the breakpoint
      this.column.rowComponent.columns.forEach((column: ColumnDevComponent) => {
        column.columnSpan.values[index].breakpoint = undefined;
        column.columnSpan.setClasses(column.columnElement);
      });

      // Get any other breakpoints
      breakpoint = this.widgetService.getBreakpoint(this.column.columnSpan.values.map(x => x.breakpoint as string));
      
      // If found, set the checkbox and column span
      if (breakpoint) {
        this.checkbox.nativeElement.checked = true;
        this.isBreakpointCheckboxChecked = true;
        this.columnSpan = this.column.columnSpan.values.find(x => x.breakpoint == breakpoint)?.span as number;
      }

      // Get the index of any other values without a breakpoint
      index = this.column.columnSpan.values.findIndex((x, columnIndex) => !x.breakpoint && columnIndex != index);

      // If found, remove that value
      if (index != -1) {
        this.column.rowComponent.columns.forEach((column: ColumnDevComponent) => {
          column.columnSpan.values.splice(index, 1);
          column.columnSpan.setClasses(column.columnElement);
        });
      }
    }
  }



  // ----------------------------------------------------------- On Value Change -----------------------------------------------------------------
  onValueChange(value: number, numberField: NumberFieldComponent) {
    if (this.column.rowComponent.columnCount == 1) {
      this.columnSpan = 12;
      numberField.setValue(12);
      return;
    }

    const maxColumnSpan: number = this.column.rowComponent.columnCount == 5 ? 10 : 12;
    value = Math.min(value, maxColumnSpan);
    const delta: number = value - this.columnSpan;
    const index: number = this.column.rowComponent.columns.findIndex(x => x == this.column);

    if (delta == 1) {
      const lastColumn = this.getLastColumn(maxColumnSpan);

      // If the last column is NOT the current column we are on
      if (lastColumn != null && lastColumn != this.column) {

        const columnSpanValueIndex = this.getColumnSpanValueIndex(lastColumn);

        // If the last column does not have a column span of one
        if (lastColumn.columnSpan.values[columnSpanValueIndex].span != 1) {
          lastColumn.columnSpan.values[columnSpanValueIndex].span -= 1;

          // The last column has a column span of one so we assign it the max column span
        } else {
          lastColumn.columnSpan.values[columnSpanValueIndex].span = maxColumnSpan;
        }

        lastColumn.columnSpan.setClasses(lastColumn.columnElement);

        // The last column is the current column we're on
      } else {
        // Get the first column that does not have a column span of one
        const firstColumn = this.getFirstColumn();

        // If the first column is NOT the current column we are on
        if (firstColumn != null && firstColumn != this.column) {
          const columnSpanValueIndex = this.getColumnSpanValueIndex(firstColumn);

          firstColumn.columnSpan.values[columnSpanValueIndex].span -= 1;

          firstColumn.columnSpan.setClasses(firstColumn.columnElement);

          // The first column is the current column we are on
          // We can't increase the value, so we reset the properties of the number field
        } else {
          numberField.setValue(this.columnSpan);
          return;
        }
      }

      // We are decreasing the column span
    } else if (delta == -1) {

      // If we are not on the first column and the column span is at max
      // We can't decrease the value, so we reset the properties of the number field
      if (index != 0 && this.columnSpan == maxColumnSpan) {
        numberField.setValue(maxColumnSpan);
        return;
      }


      // If we are on the last column, increase the column span of the previous column
      if (index == this.column.rowComponent.columns.length - 1) {
        const previousColumn = this.column.rowComponent.columns[index - 1];
        const columnSpanValueIndex = this.getColumnSpanValueIndex(previousColumn);

        previousColumn.columnSpan.values[columnSpanValueIndex].span += 1;
        previousColumn.columnSpan.setClasses(previousColumn.columnElement);

        // We are not on the last column
      } else {
        // Get the next column span that needs to be updated
        const nextColumn = this.getNextColumn(index, maxColumnSpan);

        if (nextColumn) {
          const columnSpanValueIndex = this.getColumnSpanValueIndex(nextColumn);
          const newValue = nextColumn.columnSpan.values[columnSpanValueIndex].span == maxColumnSpan ? 1 :
            nextColumn.columnSpan.values[columnSpanValueIndex].span + 1;

          // Update the column span
          nextColumn.columnSpan.values[columnSpanValueIndex].span = newValue;
          nextColumn.columnSpan.setClasses(nextColumn.columnElement);

          // We don't have a next column so we need to push new values
        } else {

          // Loop through each column and create new values
          this.column.rowComponent.columns.forEach((column: ColumnDevComponent, columnIndex: number) => {
            let newValue: number = 0;

            if (columnIndex == 0) {
              newValue = 11;
            } else if (columnIndex == 1) {
              newValue = 1;
            } else {
              newValue = 12;
            }

            column.columnSpan.values.push(new ColumnSpanValue(newValue));
            if (columnIndex != 0) column.columnSpan.setClasses(column.columnElement);
          });
        }
      }
    }

    if (delta != 0) {
      const columnSpanValue = this.column.columnSpan.values.find(x => x.breakpoint == this.widgetService
        .getBreakpoint(this.column.columnSpan.values.map(x => x.breakpoint as string)) || x.breakpoint == null);

      if (columnSpanValue) {
        this.columnSpan = columnSpanValue.span = value;
      }

      this.onChange.emit();
    }

  }




  // ----------------------------------------------------------- Get Last Column -----------------------------------------------------------------
  getLastColumn(maxColumnSpan: number): ColumnDevComponent | null {
    // This will return the last column that does not have a max column span value
    for (let i = this.column.rowComponent.columnCount - 1; i > -1; i--) {
      const currentColumn: ColumnDevComponent = this.column.rowComponent.columns[i];
      const columnSpanValueIndex = this.getColumnSpanValueIndex(currentColumn);

      if (currentColumn.columnSpan.values[columnSpanValueIndex].span != maxColumnSpan) return currentColumn;
    }

    return null;
  }


  // ---------------------------------------------------------- Get First Column ------------------------------------------------------------------
  getFirstColumn(): ColumnDevComponent | null {
    // This will return the first column that does not have a column span of one
    for (let i = 0; i < this.column.rowComponent.columnCount; i++) {
      const currentColumn: ColumnDevComponent = this.column.rowComponent.columns[i];
      const columnSpanValueIndex = this.getColumnSpanValueIndex(currentColumn);

      if (currentColumn.columnSpan.values[columnSpanValueIndex].span != 1) return currentColumn;
    }

    return null;
  }



  // -------------------------------------------------------- Get Next Column Span ----------------------------------------------------------
  getNextColumn(index: number, maxColumnSpan: number): ColumnDevComponent | null {
    let nextColumn = null;
    // This is the starting column span value for each column
    let startingColumnSpan = maxColumnSpan / this.column.rowComponent.columnCount;

    // Search back from the current column for a column that does not have the starting column span
    for (let i = index - 1; i > -1; i--) {
      const previousColumn = this.column.rowComponent.columns[i];
      const columnSpanValueIndex = this.getColumnSpanValueIndex(previousColumn);

      if (previousColumn.columnSpan.values[columnSpanValueIndex].span != startingColumnSpan) {
        nextColumn = previousColumn;
        break;
      }
    }

    // If a column was not found
    if (!nextColumn) {

      // Search forward from the current column for a column that does not have the starting column span
      for (let i = index + 1; i < this.column.rowComponent.columns.length; i++) {
        const followingColumn = this.column.rowComponent.columns[i];
        const columnSpanValueIndex = this.getColumnSpanValueIndex(followingColumn);

        if (columnSpanValueIndex == -1) return null;

        if (followingColumn.columnSpan.values[columnSpanValueIndex].span != startingColumnSpan) {
          nextColumn = followingColumn;
          break;
        }
      }
    }


    // If we still haven't found a column, use the last column in the row
    if (!nextColumn) nextColumn = this.column.rowComponent.columns[this.column.rowComponent.columns.length - 1];

    return nextColumn;
  }
}
