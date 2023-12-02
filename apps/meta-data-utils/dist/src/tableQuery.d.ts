import { ISchemaMetaData, ITableMetaData, KeyObject } from "./types";
export declare const buildRecordDetailsQueryFields: (schemas: Record<string, ISchemaMetaData>, schemaId: string, tableId: string) => string;
export declare const buildRecordListQueryFields: (tableId: string, schemaId: string, schemas: Record<string, ISchemaMetaData>) => string;
export declare const extractExternalSchemas: (schemaMetaData: ISchemaMetaData) => string[];
export declare const extractKeyFromRecord: (record: any, tableId: string, schemaId: string, schemas: Record<string, ISchemaMetaData>) => any;
export declare const buildFilterFromKeysObject: (keys: KeyObject) => Record<string, object>;
export declare const getTableMetaData: (schemaMetaData: ISchemaMetaData, tableId: string) => ITableMetaData;
