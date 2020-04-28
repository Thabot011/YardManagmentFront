import { SortDirection } from "@angular/material/sort";

export interface Paging {
    pageNum: number;
    pageSize: number;
    sortDirection: SortDirection;
    sortProperty: string;
}

