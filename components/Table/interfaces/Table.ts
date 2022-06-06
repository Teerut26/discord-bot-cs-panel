import { Column } from "react-table";

export interface TableInterface {
    columns: Column[];
    data: any;
    title: string;
    sortBy?: SortBy[];
  }
  
  export interface SortBy {
    id: string | Function | any;
    desc: boolean;
  }