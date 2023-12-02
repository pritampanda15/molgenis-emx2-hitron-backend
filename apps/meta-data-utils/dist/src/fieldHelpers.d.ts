import { IColumn } from "./types";
export declare const fieldTypes: () => string[];
export declare const isEmpty: (obj: object) => boolean;
export declare const isValueType: (column: IColumn) => boolean;
export declare const isRefType: (column: IColumn) => boolean;
export declare const isArrayType: (column: IColumn) => boolean;
export declare const isFileType: (column: IColumn) => boolean;
