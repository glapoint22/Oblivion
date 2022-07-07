import { Component, Input } from '@angular/core';
import { Breakpoint, ColumnSpanValue } from 'widgets';
import { BreakpointsComponent } from '../breakpoints/breakpoints.component';
import { ColumnDevComponent } from '../column-dev/column-dev.component';

@Component({
  selector: 'column-span',
  templateUrl: '../breakpoints/breakpoints.component.html',
  styleUrls: ['../breakpoints/breakpoints.component.scss']
})
export class ColumnSpanComponent extends BreakpointsComponent<ColumnSpanValue, number> {
  @Input() column!: ColumnDevComponent;
  public breakpointOptions: Array<number> = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
  ]


  // --------------------------------------------------------------------- Ng On Init -------------------------------------------------------------
  public ngOnInit(): void {
    super.ngOnInit();
    this.title = 'Column Span';
  }


  // -------------------------------------------------------------------- Get Breakpoints ---------------------------------------------------------
  public getBreakpoints(): Array<Breakpoint> {
    this.column.columnSpan.values = this.column.columnSpan.values.sort((a, b) => a.breakpoint > b.breakpoint ? 1 : -1);

    const breakpoints: Array<Breakpoint> = new Array<Breakpoint>();

    breakpoints.push({
      label: 'Span',
      values: []
    });

    const breakpoint = breakpoints[0];

    this.column.columnSpan.values.forEach((columnSpanValue: ColumnSpanValue) => {
      breakpoint.values.push(columnSpanValue);
    });

    return breakpoints;
  }






  // --------------------------------------------------------------------- Set Value ---------------------------------------------------------
  public setValue(columnSpanValue: ColumnSpanValue, value: number, direction: number): void {
    // Prevent value change if we only have one column
    if (this.column.rowComponent.columnCount == 1) return;


    const maxColumnSpan: number = this.column.rowComponent.columnCount == 5 ? 10 : 12;
    const columnSpan = Math.min(value, maxColumnSpan);

    if (direction == 1) {
      if (columnSpanValue.span == maxColumnSpan) return;

      const lastColumn = this.getLastColumn(maxColumnSpan, columnSpanValue.breakpoint);

      // If the last column is NOT the current column we are on
      if (lastColumn != null && lastColumn != this.column) {
        const columnSpanValueIndex = lastColumn.columnSpan.values.findIndex(x => x.breakpoint == columnSpanValue.breakpoint);

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
        const firstColumn = this.getFirstColumn(columnSpanValue.breakpoint, maxColumnSpan);


        if (firstColumn != null) {
          const columnSpanValueIndex = firstColumn.columnSpan.values.findIndex(x => x.breakpoint == columnSpanValue.breakpoint);

          firstColumn.columnSpan.values[columnSpanValueIndex].span -= 1;

          firstColumn.columnSpan.setClasses(firstColumn.columnElement);

          // The first column is the current column we are on
          // We can't increase the value, so we return
        } else {
          return;
        }
      }

    } else if (direction == -1) {
      const index: number = this.column.rowComponent.columns.findIndex(x => x == this.column);

      // If we are not on the first column and the column span is at max
      // We can't decrease the value, so we return
      if ((index != 0 && columnSpanValue.span == maxColumnSpan) || columnSpanValue.span == 1) return;

      // If we are on the last column, increase the column span of the previous column
      if (index == this.column.rowComponent.columns.length - 1) {
        const previousColumn = this.column.rowComponent.columns[index - 1];
        const columnSpanValueIndex = previousColumn.columnSpan.values.findIndex(x => x.breakpoint == columnSpanValue.breakpoint);

        previousColumn.columnSpan.values[columnSpanValueIndex].span += 1;
        previousColumn.columnSpan.setClasses(previousColumn.columnElement);

        // We are not on the last column
      } else {
        // Get the next column span that needs to be updated
        const nextColumn = this.getNextColumn(index, maxColumnSpan, columnSpanValue.breakpoint);

        if (nextColumn) {
          const columnSpanValueIndex = nextColumn.columnSpan.values.findIndex(x => x.breakpoint == columnSpanValue.breakpoint);
          const newValue = nextColumn.columnSpan.values[columnSpanValueIndex].span == maxColumnSpan ? 1 :
            nextColumn.columnSpan.values[columnSpanValueIndex].span + 1;

          // Update the column span
          nextColumn.columnSpan.values[columnSpanValueIndex].span = newValue;
          nextColumn.columnSpan.setClasses(nextColumn.columnElement);
        }
      }
    }

    columnSpanValue.setValue(columnSpan);
    super.setValue(columnSpanValue, value, direction);
  }









  // --------------------------------------------------------------------- Add Breakpoint ---------------------------------------------------------
  public addBreakpoint(breakpoint: number, label?: string): ColumnSpanValue {
    let columnSpanValue!: ColumnSpanValue;

    this.column.rowComponent.columns.forEach((column: ColumnDevComponent) => {
      // Get the span for the new breakpoint
      let span: number = 0;
      for (let i = column.columnSpan.values.length - 1; i > -1; i--) {
        const currentValue = column.columnSpan.values[i];

        if (currentValue.breakpoint < breakpoint) {
          span = currentValue.span;
          break;
        }
      }

      // Assign the new column span value
      const value = new ColumnSpanValue(span, breakpoint);
      column.columnSpan.values.push(value);


      if (column == this.column) {
        columnSpanValue = value;
      } else {
        // Set the breakpoint classes
        column.columnSpan.setClasses(column.columnElement);
      }
    });

    return columnSpanValue;

  }





  // --------------------------------------------------------------------- Delete Breakpoint ---------------------------------------------------------
  public deleteBreakpoint(value: ColumnSpanValue): void {
    this.column.rowComponent.columns.forEach((column: ColumnDevComponent) => {
      const index = column.columnSpan.values.findIndex(x => x.breakpoint == value.breakpoint);

      column.columnSpan.values.splice(index, 1);

      if (value.breakpoint == 0) {
        column.columnSpan.values[index].breakpoint = 0;
      }

      if (column != this.column) {
        // Set the breakpoint classes
        column.columnSpan.setClasses(column.columnElement);
      }
    });
  }




  // ------------------------------------------------------------------------- Can Delete --------------------------------------------------------------
  public canDelete(value: ColumnSpanValue): boolean {
    return this.column.columnSpan.values.length > 1;
  }






  // --------------------------------------------------------------------------- Can Add ----------------------------------------------------------------
  public canAdd(breakpoint: number, label?: string): boolean {
    return !this.column.columnSpan.values.some(x => x.breakpoint == breakpoint);
  }











  // ----------------------------------------------------------- Get Last Column -----------------------------------------------------------------
  getLastColumn(maxColumnSpan: number, breakpoint: number): ColumnDevComponent | null {
    // This will return the last column that does not have a max column span value
    for (let i = this.column.rowComponent.columnCount - 1; i > -1; i--) {
      const currentColumn: ColumnDevComponent = this.column.rowComponent.columns[i];
      const columnSpanValueIndex = currentColumn.columnSpan.values.findIndex(x => x.breakpoint == breakpoint);

      if (currentColumn.columnSpan.values[columnSpanValueIndex].span != maxColumnSpan) return currentColumn;
    }

    return null;
  }







  // ---------------------------------------------------------- Get First Column ------------------------------------------------------------------
  getFirstColumn(breakpoint: number, maxColumnSpan: number): ColumnDevComponent | null {
    // This will return the first column that does not have a column span of one
    for (let i = this.column.rowComponent.columnCount - 1; i > -1; i--) {
      const currentColumn: ColumnDevComponent = this.column.rowComponent.columns[i];
      const columnSpanValueIndex = currentColumn.columnSpan.values.findIndex(x => x.breakpoint == breakpoint);

      if (currentColumn.columnSpan.values[columnSpanValueIndex].span != 1 && currentColumn.columnSpan.values[columnSpanValueIndex].span != maxColumnSpan && currentColumn != this.column) return currentColumn;
    }

    return null;
  }



  // -------------------------------------------------------- Get Next Column Span ----------------------------------------------------------
  getNextColumn(index: number, maxColumnSpan: number, breakpoint: number): ColumnDevComponent | null {
    let nextColumn = null;
    // This is the starting column span value for each column
    let startingColumnSpan = maxColumnSpan / this.column.rowComponent.columnCount;

    // Search back from the current column for a column that does not have the starting column span
    for (let i = index - 1; i > -1; i--) {
      const previousColumn = this.column.rowComponent.columns[i];
      const columnSpanValueIndex = previousColumn.columnSpan.values.findIndex(x => x.breakpoint == breakpoint);

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
        const columnSpanValueIndex = followingColumn.columnSpan.values.findIndex(x => x.breakpoint == breakpoint);

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