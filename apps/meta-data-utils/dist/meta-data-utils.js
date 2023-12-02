const N = () => [
  "BOOL",
  "BOOL_ARRAY",
  "DATE",
  "DATE_ARRAY",
  "DATETIME",
  "AUTO_ID",
  "DATETIME_ARRAY",
  "DECIMAL",
  "DECIMAL_ARRAY",
  "EMAIL",
  "EMAIL_ARRAY",
  "FILE",
  "HEADING",
  "HYPERLINK",
  "HYPERLINK_ARRAY",
  "INT",
  "INT_ARRAY",
  "LONG",
  "LONG_ARRAY",
  "ONTOLOGY",
  "ONTOLOGY_ARRAY",
  "REF",
  "REF_ARRAY",
  "REFBACK",
  "STRING",
  "STRING_ARRAY",
  "TEXT",
  "TEXT_ARRAY",
  "UUID",
  "UUID_ARRAY"
], w = (e) => {
  for (const r in e)
    if (Object.hasOwnProperty.call(e, r))
      return !1;
  return !0;
}, E = (e) => e.columnType === "STRING" || e.columnType === "TEXT" || e.columnType === "EMAIL" || e.columnType === "HYPERLINK" || e.columnType === "UUID" || e.columnType === "DATE" || e.columnType === "DATETIME" || e.columnType === "INT" || e.columnType === "LONG" || e.columnType === "DECIMAL", O = (e) => e.columnType === "REF" || e.columnType === "REFBACK" || e.columnType === "ONTOLOGY", F = (e) => e.columnType.endsWith("_ARRAY"), I = (e) => e.columnType === "FILE", p = "{ id, size, extension, url }", _ = (e, r, t) => {
  const l = e[r].tables.find(
    (o) => o.id === t
  ), T = l == null ? void 0 : l.columns, d = T == null ? void 0 : T.filter((o) => !o.id.startsWith("mg_")).filter((o) => o.columnType !== "HEADING"), s = (o) => {
    const R = e[o.refSchemaId || r].tables.find((a) => a.id === o.refTableId), c = R == null ? void 0 : R.columns, f = c == null ? void 0 : c.filter((a) => !a.id.startsWith("mg_")).filter((a) => a.columnType !== "HEADING"), u = f == null ? void 0 : f.map((a) => {
      switch (a.columnType) {
        case "STRING":
        case "TEXT":
          return a.id;
        case "FILE":
          return `${a.id} ${p}`;
        case "REF":
        case "ONTOLOGY":
        case "REF_ARRAY":
        case "REFBACK":
        case "ONTOLOGY_ARRAY":
          return "";
        default:
          return a.id;
      }
    });
    return u ? u.join(" ") : "";
  }, i = d == null ? void 0 : d.map((o) => {
    switch (o.columnType) {
      case "STRING":
      case "TEXT":
        return o.id;
      case "FILE":
        return `${o.id} ${p}`;
      case "REF":
      case "ONTOLOGY":
      case "REF_ARRAY":
      case "REFBACK":
      case "ONTOLOGY_ARRAY":
        return `${o.id} { ${s(o)} }`;
      default:
        return o.id;
    }
  });
  return i ? i.join(" ") : "";
}, h = (e, r, t) => {
  const n = L(e, r, t), l = A(t[r], e);
  if (l === void 0)
    throw new Error(
      "buildRecordListQueryFields; tableMetaData is undefined for tableId " + e + " in schema " + r
    );
  const T = l.columns.map((y) => y.id), d = [
    "id",
    "label",
    "description",
    "pid",
    "acronym",
    "logo"
  ].filter((y) => T.includes(y));
  d[d.length - 1] === "logo" && d.push(["id", "size", "extension", "url"]);
  const s = [.../* @__PURE__ */ new Set([...n, ...d])];
  return D(s);
}, D = (e) => e.reduce((r, t) => Array.isArray(t) ? r += " { " + D(t) + " } " : r += " " + t, ""), L = (e, r, t) => {
  const n = t[r];
  return A(n, e).columns.reduce(
    (d, s) => {
      if (s.key === 1)
        if (E(s))
          d.push(s.id);
        else if (O(s))
          if (s.refTableId)
            d.push(s.id), d.push(
              L(
                s.refTableId,
                s.refSchemaId || r,
                t
              )
            );
          else
            throw new Error(
              "refTable is undefined for refColumn with id " + s.id + " in table " + e
            );
        else
          F(s) ? console.log(
            "TODO: buildRecordListQueryFields, key column isArrayType, skip for now"
          ) : I(s) ? console.log(
            "TODO: buildRecordListQueryFields, key column isFileType, skip for now"
          ) : console.log(
            "TODO: buildRecordListQueryFields, key column is unknown type, skip for now"
          );
      return d;
    },
    []
  ) || [];
}, k = (e) => [
  ...new Set(
    e.tables.reduce((r, t) => (t.columns.forEach((n) => {
      n.refSchemaId && r.push(n.refSchemaId);
    }), r), [])
  )
], b = (e, r, t, n) => {
  const l = n[t];
  return A(l, r).columns.reduce((s, i) => {
    if (i.key === 1 && e[i.id])
      if (E(i))
        s[i.id] = e[i.id];
      else if (O(i))
        if (i.refTableId)
          s[i.id] = b(
            e[i.id],
            i.refTableId,
            i.refSchemaId || t,
            n
          );
        else
          throw new Error(
            "refTable is undefined for refColumn with id " + i.id + " in table " + r
          );
      else
        F(i) ? console.log(
          "TODO: extractKeyFromRecord, key column isArrayType, skip for now"
        ) : I(i) ? console.log(
          "TODO: extractKeyFromRecord, key column isFileType, skip for now"
        ) : console.log(
          "TODO: extractKeyFromRecord, key column is unknown type, skip for now"
        );
    return s;
  }, {}) || {};
}, M = (e) => Object.entries(e).reduce(
  (r, [t, n]) => (r[t] = { equals: [n] }, r),
  {}
), A = (e, r) => {
  const t = e.tables.find(
    (n) => n.id === r
  );
  if (t === void 0) {
    const n = "ERROR: tableMetaData is undefined for tableId " + r;
    throw console.log(n), new Error(n);
  }
  return t;
}, G = (e) => `Hello ${e}`;
export {
  M as buildFilterFromKeysObject,
  _ as buildRecordDetailsQueryFields,
  h as buildRecordListQueryFields,
  k as extractExternalSchemas,
  b as extractKeyFromRecord,
  N as fieldTypes,
  A as getTableMetaData,
  w as isEmpty,
  E as isValueType,
  G as sayHello
};
