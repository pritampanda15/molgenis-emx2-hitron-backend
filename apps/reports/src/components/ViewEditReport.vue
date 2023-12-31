<template>
  <Spinner v-if="!session" />
  <MessageWarning
    v-else-if="
      !session ||
      !session.roles ||
      !['Viewer'].some((r) => session.roles.includes(r))
    "
  >
    Schema doesn't exist or you don't have permission to view. Might you need to
    login?
  </MessageWarning>
  <div v-else>
    <router-link to="/">&lt; back to report list</router-link>
    <div v-if="edit">
      <h2>
        Edit report: {{ id }}<IconAction icon="eye" @click="edit = false" />
      </h2>
      <InputString id="reportName" v-model="name" label="name" />
      <InputText
        id="reportSql"
        v-model="sql"
        label="sql"
        description="You can type postgresql compatible SQL. You can also create parameters, e.g. ${name:string_array}, which will create a parameter 'name' that then internally is treated as a string_array (see column types). See the download link to understand how parameters are used in URL."
      />
      <MessageSuccess v-if="success">{{ success }}</MessageSuccess>
      <ButtonAction @click="save">Save</ButtonAction>
      <div class="mt-2">
        <h2>View report: {{ id }}</h2>
      </div>
    </div>
    <h2 v-else>
      Report: {{ name
      }}<IconAction v-if="canEdit" icon="pencil-alt" @click="edit = true" />
    </h2>
    <div v-if="parameterInputs">
      Please provide parameters:
      <FormInput
        v-for="input in parameterInputs"
        :id="input.name"
        :label="input.name"
        :name="input.name"
        :columnType="input.columnType"
        v-model="parameters[input.name]"
      />
      <ButtonAction @click="run">run</ButtonAction>
    </div>
    <MessageError v-if="error">{{ error }}</MessageError>
    <div v-if="rows && rows.length > 0">
      <Pagination v-if="count" v-model="page" :limit="limit" :count="count" />
      download as <a :href="downloadZip">zip</a> or
      <a :href="downloadExcel">excel</a>
      <TableSimple
        :columns="columns"
        :rows="rows"
        class="bg-white"
        :key="JSON.stringify(this.rows)"
      />
    </div>
    <div v-else-if="rows">No results found.</div>
  </div>
</template>

<script>
import {
  Client,
  TableSimple,
  ButtonAction,
  InputText,
  InputString,
  MessageError,
  MessageSuccess,
  Pagination,
  IconAction,
  Spinner,
  MessageWarning,
  FormInput,
} from "molgenis-components";
import { request } from "graphql-request";

export default {
  name: "EditQuery",
  components: {
    TableSimple,
    ButtonAction,
    InputText,
    MessageError,
    MessageSuccess,
    InputString,
    Pagination,
    IconAction,
    Spinner,
    MessageWarning,
    FormInput,
  },
  props: {
    session: Object,
    id: String,
    limit: { type: Number, default: 5 },
  },
  data() {
    return {
      rows: undefined,
      count: null,
      sql: 'select * from "Pet"',
      name: null,
      parameters: {},
      error: null,
      success: null,
      page: 1,
      edit: false,
    };
  },
  computed: {
    columns() {
      if (this.rows) {
        const names = [];
        this.rows.forEach((row) => {
          Object.keys(row).forEach((key) => {
            if (names.indexOf(key) === -1) {
              names.push(key);
            }
          });
        });
        return names;
      }
    },
    parameterKeyValueMap() {
      return Object.entries(this.parameters).map(([key, value]) => ({
        key: key,
        value: Array.isArray(value) ? value.join(",") : value,
      }));
    },
    canEdit() {
      return this.session?.roles?.includes("Manager");
    },
    parameterInputs() {
      const regex = /\${([^}]+)}/g;
      const matches = this.sql.match(regex);
      if (matches)
        return matches
          .map((match) => match.substr(2, match.length - 3))
          .map((match) =>
            match.includes(":")
              ? {
                  name: match.split(":")[0],
                  columnType: match.split(":")[1].toUpperCase(),
                }
              : { name: match, columnType: "STRING" }
          );
    },
    parametersQuery() {
      return Object.entries(this.parameters)
        .map((entry) =>
          Array.isArray(entry[1])
            ? "&" + entry[0] + "=" + entry[1].join(",")
            : "&" + entry[0] + "=" + entry[1]
        )
        .join("");
    },
    downloadZip() {
      return "../api/reports/zip?id=" + this.id + this.parametersQuery;
    },
    downloadExcel() {
      return "../api/reports/zip?id=" + this.id + this.parametersQuery;
    },
  },
  methods: {
    async run() {
      this.error = null;
      const offset = this.limit * (this.page - 1);
      const result = await request(
        "graphql",
        `query report($parameters:[MolgenisSettingsInput]) {_reports(id:${this.id},parameters:$parameters,limit:${this.limit},offset:${offset}){data,count}}`,
        {
          parameters: this.parameterKeyValueMap,
        }
      ).catch((error) => {
        this.error = error.response.errors[0].message;
      });
      this.rows = JSON.parse(result._reports.data);
      this.count = result._reports.count;
    },
    async save() {
      this.succes = null;
      this.error = null;
      const reports = await this.client.fetchSettingValue("reports");
      reports[this.id].sql = this.sql;
      reports[this.id].name = this.name;
      this.client
        .saveSetting("reports", reports)
        .then((res) => {
          this.success = "Saved report " + this.id + " and refreshed query";
          this.run();
        })
        .catch((error) => (this.error = error));
    },
    async reload() {
      const reports = await this.client.fetchSettingValue("reports");
      if (reports[this.id]) {
        this.sql = reports[this.id].sql;
        this.name = reports[this.id].name;
      } else {
        this.error = "report not found";
      }
      if (!this.sql.includes("${")) {
        await this.run();
      }
    },
  },
  watch: {
    page() {
      this.run();
    },
  },
  mounted() {
    this.client = Client.newClient();
    this.reload();
  },
};
</script>
