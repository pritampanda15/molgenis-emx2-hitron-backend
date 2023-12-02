(function(o,c){typeof exports=="object"&&typeof module<"u"?c(exports):typeof define=="function"&&define.amd?define(["exports"],c):(o=typeof globalThis<"u"?globalThis:o||self,c(o.MetaDataUtils={}))})(this,function(o){"use strict";const c=()=>["BOOL","BOOL_ARRAY","DATE","DATE_ARRAY","DATETIME","AUTO_ID","DATETIME_ARRAY","DECIMAL","DECIMAL_ARRAY","EMAIL","EMAIL_ARRAY","FILE","HEADING","HYPERLINK","HYPERLINK_ARRAY","INT","INT_ARRAY","LONG","LONG_ARRAY","ONTOLOGY","ONTOLOGY_ARRAY","REF","REF_ARRAY","REFBACK","STRING","STRING_ARRAY","TEXT","TEXT_ARRAY","UUID","UUID_ARRAY"],N=e=>{for(const t in e)if(Object.hasOwnProperty.call(e,t))return!1;return!0},R=e=>e.columnType==="STRING"||e.columnType==="TEXT"||e.columnType==="EMAIL"||e.columnType==="HYPERLINK"||e.columnType==="UUID"||e.columnType==="DATE"||e.columnType==="DATETIME"||e.columnType==="INT"||e.columnType==="LONG"||e.columnType==="DECIMAL",F=e=>e.columnType==="REF"||e.columnType==="REFBACK"||e.columnType==="ONTOLOGY",O=e=>e.columnType.endsWith("_ARRAY"),b=e=>e.columnType==="FILE",D="{ id, size, extension, url }",M=(e,t,r)=>{const y=e[t].tables.find(d=>d.id===r),T=y==null?void 0:y.columns,l=T==null?void 0:T.filter(d=>!d.id.startsWith("mg_")).filter(d=>d.columnType!=="HEADING"),i=d=>{const A=e[d.refSchemaId||t].tables.find(a=>a.id===d.refTableId),E=A==null?void 0:A.columns,p=E==null?void 0:E.filter(a=>!a.id.startsWith("mg_")).filter(a=>a.columnType!=="HEADING"),h=p==null?void 0:p.map(a=>{switch(a.columnType){case"STRING":case"TEXT":return a.id;case"FILE":return`${a.id} ${D}`;case"REF":case"ONTOLOGY":case"REF_ARRAY":case"REFBACK":case"ONTOLOGY_ARRAY":return"";default:return a.id}});return h?h.join(" "):""},s=l==null?void 0:l.map(d=>{switch(d.columnType){case"STRING":case"TEXT":return d.id;case"FILE":return`${d.id} ${D}`;case"REF":case"ONTOLOGY":case"REF_ARRAY":case"REFBACK":case"ONTOLOGY_ARRAY":return`${d.id} { ${i(d)} }`;default:return d.id}});return s?s.join(" "):""},w=(e,t,r)=>{const n=L(e,t,r),y=f(r[t],e);if(y===void 0)throw new Error("buildRecordListQueryFields; tableMetaData is undefined for tableId "+e+" in schema "+t);const T=y.columns.map(u=>u.id),l=["id","label","description","pid","acronym","logo"].filter(u=>T.includes(u));l[l.length-1]==="logo"&&l.push(["id","size","extension","url"]);const i=[...new Set([...n,...l])];return I(i)},I=e=>e.reduce((t,r)=>Array.isArray(r)?t+=" { "+I(r)+" } ":t+=" "+r,""),L=(e,t,r)=>{const n=r[t];return f(n,e).columns.reduce((l,i)=>{if(i.key===1)if(R(i))l.push(i.id);else if(F(i))if(i.refTableId)l.push(i.id),l.push(L(i.refTableId,i.refSchemaId||t,r));else throw new Error("refTable is undefined for refColumn with id "+i.id+" in table "+e);else O(i)?console.log("TODO: buildRecordListQueryFields, key column isArrayType, skip for now"):b(i)?console.log("TODO: buildRecordListQueryFields, key column isFileType, skip for now"):console.log("TODO: buildRecordListQueryFields, key column is unknown type, skip for now");return l},[])||[]},_=e=>[...new Set(e.tables.reduce((t,r)=>(r.columns.forEach(n=>{n.refSchemaId&&t.push(n.refSchemaId)}),t),[]))],Y=(e,t,r,n)=>{const y=n[r];return f(y,t).columns.reduce((i,s)=>{if(s.key===1&&e[s.id])if(R(s))i[s.id]=e[s.id];else if(F(s))if(s.refTableId)i[s.id]=Y(e[s.id],s.refTableId,s.refSchemaId||r,n);else throw new Error("refTable is undefined for refColumn with id "+s.id+" in table "+t);else O(s)?console.log("TODO: extractKeyFromRecord, key column isArrayType, skip for now"):b(s)?console.log("TODO: extractKeyFromRecord, key column isFileType, skip for now"):console.log("TODO: extractKeyFromRecord, key column is unknown type, skip for now");return i},{})||{}},k=e=>Object.entries(e).reduce((t,[r,n])=>(t[r]={equals:[n]},t),{}),f=(e,t)=>{const r=e.tables.find(n=>n.id===t);if(r===void 0){const n="ERROR: tableMetaData is undefined for tableId "+t;throw console.log(n),new Error(n)}return r},g=e=>`Hello ${e}`;o.buildFilterFromKeysObject=k,o.buildRecordDetailsQueryFields=M,o.buildRecordListQueryFields=w,o.extractExternalSchemas=_,o.extractKeyFromRecord=Y,o.fieldTypes=c,o.getTableMetaData=f,o.isEmpty=N,o.isValueType=R,o.sayHello=g,Object.defineProperty(o,Symbol.toStringTag,{value:"Module"})});