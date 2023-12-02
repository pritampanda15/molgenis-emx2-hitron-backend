var MetaDataUtils=function(a){"use strict";const N=()=>["BOOL","BOOL_ARRAY","DATE","DATE_ARRAY","DATETIME","AUTO_ID","DATETIME_ARRAY","DECIMAL","DECIMAL_ARRAY","EMAIL","EMAIL_ARRAY","FILE","HEADING","HYPERLINK","HYPERLINK_ARRAY","INT","INT_ARRAY","LONG","LONG_ARRAY","ONTOLOGY","ONTOLOGY_ARRAY","REF","REF_ARRAY","REFBACK","STRING","STRING_ARRAY","TEXT","TEXT_ARRAY","UUID","UUID_ARRAY"],M=e=>{for(const t in e)if(Object.hasOwnProperty.call(e,t))return!1;return!0},R=e=>e.columnType==="STRING"||e.columnType==="TEXT"||e.columnType==="EMAIL"||e.columnType==="HYPERLINK"||e.columnType==="UUID"||e.columnType==="DATE"||e.columnType==="DATETIME"||e.columnType==="INT"||e.columnType==="LONG"||e.columnType==="DECIMAL",F=e=>e.columnType==="REF"||e.columnType==="REFBACK"||e.columnType==="ONTOLOGY",O=e=>e.columnType.endsWith("_ARRAY"),p=e=>e.columnType==="FILE",D="{ id, size, extension, url }",w=(e,t,r)=>{const y=e[t].tables.find(o=>o.id===r),T=y==null?void 0:y.columns,d=T==null?void 0:T.filter(o=>!o.id.startsWith("mg_")).filter(o=>o.columnType!=="HEADING"),i=o=>{const f=e[o.refSchemaId||t].tables.find(l=>l.id===o.refTableId),A=f==null?void 0:f.columns,E=A==null?void 0:A.filter(l=>!l.id.startsWith("mg_")).filter(l=>l.columnType!=="HEADING"),Y=E==null?void 0:E.map(l=>{switch(l.columnType){case"STRING":case"TEXT":return l.id;case"FILE":return`${l.id} ${D}`;case"REF":case"ONTOLOGY":case"REF_ARRAY":case"REFBACK":case"ONTOLOGY_ARRAY":return"";default:return l.id}});return Y?Y.join(" "):""},s=d==null?void 0:d.map(o=>{switch(o.columnType){case"STRING":case"TEXT":return o.id;case"FILE":return`${o.id} ${D}`;case"REF":case"ONTOLOGY":case"REF_ARRAY":case"REFBACK":case"ONTOLOGY_ARRAY":return`${o.id} { ${i(o)} }`;default:return o.id}});return s?s.join(" "):""},h=(e,t,r)=>{const n=I(e,t,r),y=c(r[t],e);if(y===void 0)throw new Error("buildRecordListQueryFields; tableMetaData is undefined for tableId "+e+" in schema "+t);const T=y.columns.map(u=>u.id),d=["id","label","description","pid","acronym","logo"].filter(u=>T.includes(u));d[d.length-1]==="logo"&&d.push(["id","size","extension","url"]);const i=[...new Set([...n,...d])];return b(i)},b=e=>e.reduce((t,r)=>Array.isArray(r)?t+=" { "+b(r)+" } ":t+=" "+r,""),I=(e,t,r)=>{const n=r[t];return c(n,e).columns.reduce((d,i)=>{if(i.key===1)if(R(i))d.push(i.id);else if(F(i))if(i.refTableId)d.push(i.id),d.push(I(i.refTableId,i.refSchemaId||t,r));else throw new Error("refTable is undefined for refColumn with id "+i.id+" in table "+e);else O(i)?console.log("TODO: buildRecordListQueryFields, key column isArrayType, skip for now"):p(i)?console.log("TODO: buildRecordListQueryFields, key column isFileType, skip for now"):console.log("TODO: buildRecordListQueryFields, key column is unknown type, skip for now");return d},[])||[]},_=e=>[...new Set(e.tables.reduce((t,r)=>(r.columns.forEach(n=>{n.refSchemaId&&t.push(n.refSchemaId)}),t),[]))],L=(e,t,r,n)=>{const y=n[r];return c(y,t).columns.reduce((i,s)=>{if(s.key===1&&e[s.id])if(R(s))i[s.id]=e[s.id];else if(F(s))if(s.refTableId)i[s.id]=L(e[s.id],s.refTableId,s.refSchemaId||r,n);else throw new Error("refTable is undefined for refColumn with id "+s.id+" in table "+t);else O(s)?console.log("TODO: extractKeyFromRecord, key column isArrayType, skip for now"):p(s)?console.log("TODO: extractKeyFromRecord, key column isFileType, skip for now"):console.log("TODO: extractKeyFromRecord, key column is unknown type, skip for now");return i},{})||{}},k=e=>Object.entries(e).reduce((t,[r,n])=>(t[r]={equals:[n]},t),{}),c=(e,t)=>{const r=e.tables.find(n=>n.id===t);if(r===void 0){const n="ERROR: tableMetaData is undefined for tableId "+t;throw console.log(n),new Error(n)}return r},g=e=>`Hello ${e}`;return a.buildFilterFromKeysObject=k,a.buildRecordDetailsQueryFields=w,a.buildRecordListQueryFields=h,a.extractExternalSchemas=_,a.extractKeyFromRecord=L,a.fieldTypes=N,a.getTableMetaData=c,a.isEmpty=M,a.isValueType=R,a.sayHello=g,Object.defineProperty(a,Symbol.toStringTag,{value:"Module"}),a}({});
