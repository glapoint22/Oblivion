import { ContainerComponent } from "../components/container/container.component";
import { Background } from "./background";
import { Row } from "./row";

export class PageContent {
    public background!: Background;
    public rows!: Array<Row>;
    public set container(container: ContainerComponent) {

        if (this.rows && this.rows.length > 0) {
            container.viewContainerRef.clear();

            // Loop through the rows
            this.rows.forEach((row: Row) => {

                // Create the row
                container.createRow(row);
            });
        }
    }


    constructor(page: PageContent) {
        this.background = page.background;
        this.rows = page.rows;
    }
}