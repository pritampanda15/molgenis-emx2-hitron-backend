<template>
  <div>
    <RoutedTableExplorer
      :showColumns="defaultColumns"
      :showFilters="defaultFilters"
      :tableId="tableId"
      :showCards="defaultCards"
      :initialSearchTerms="searchTerm"
      :canEdit="canEdit"
      :canManage="canManage"
      :canView="true"
      @rowClick="openDetailView"
      @searchTerms="onSearchTermUpdate"
    />
  </div>
</template>

<script>
import { RoutedTableExplorer } from "molgenis-components";
import { mapActions, mapGetters } from "vuex";

const css = {
  Institutions: "bg-dark text-white",
  Datasources: "bg-secondary text-white",
  Databanks: "bg-info text-white",
  Cohorts: "bg-primary text-white",
  Models: "bg-warning text-dark",
  Networks: "bg-danger text-white",
  Studies: "bg-success text-white",
  Contacts: "bg-info text-white",
  Affiliations: "bg-info text-white",
  Releases: "bg-dark text-white",
  Datasets: "bg-dark text-white",
  Variables: "bg-dark text-white",
  DatasetMappings: "bg-dark text-white",
  VariableMappings: "bg-dark text-white",
};

export default {
  components: {
    RoutedTableExplorer,
  },
  props: {
    tableId: String,
    searchTerm: String,
  },
  computed: {
    ...mapGetters(["canEdit", "canManage"]),
    headerCss() {
      return css[this.tableId];
    },
    detailRouteName() {
      //detailRoute is name of table minus trailing 's'
      return this.tableId + "-details";
    },
    defaultCards() {
      if (this.tableId == "Institutions") {
        return true;
      }
      return false;
    },
    defaultColumns() {
      if (this.tableId == "DataSources") {
        return ["id", "name", "leadOrganisation", "website"];
      } else if (this.tableId == "Organisations") {
        return ["name", "id", "type", "country"];
      } else if (["DataSources", "Networks", "Models"].includes(this.tableId)) {
        return ["name", "id", "type", "leadOrganisation"];
      } else if (this.tableId == "Cohorts") {
        return ["id", "name", "keywords", "noParticipants"];
      } else if (this.tableId == "Studies") {
        return ["id", "name", "keywords"];
      } else if (this.tableId == "Contacts") {
        return [
          "name",
          "institution",
          "affiliation",
          "email",
          "orcid",
          "homepage",
        ];
      } else if (this.tableId == "Datasets") {
        return ["resource", "name"];
      } else if (this.tableId == "Variables") {
        return [
          "source",
          "dataset",
          "name",
          "label",
          "format",
          "unit",
          "topics",
          "description",
          "mandatory",
        ];
      }
    },
    defaultFilters() {
      if (this.tableId == "Organisations") {
        return ["institution", "name", "type", "country"];
      }
      if (this.tableId == "Studies") {
        return ["keywords", "networks", "startYear", "endYear"];
      }
      if (this.tableId == "Cohorts") {
        return [
          "name",
          "sampleCategories",
          "dataCategories",
          "numberOfParticpants",
          "ageCategories",
        ];
      }
      return ["type"];
    },
  },
  methods: {
    ...mapActions(["reloadMetadata"]),
    onSearchTermUpdate(searchTerm) {
      let newQuery = { ...this.$route.query };
      if (searchTerm) {
        newQuery.q = searchTerm;
      } else {
        delete newQuery.q;
      }
      this.$router.replace({
        ...this.$route,
        query: newQuery,
      });
    },
    openDetailView(row) {
      if (this.tableId == "DatasetMappings") {
        this.$router.push({
          name: "DatasetMappings-details",
          params: {
            source: row.source.id,
            sourceDataset: row.sourceDataset.name,
            target: row.target.id,
            targetDataset: row.targetDataset.name,
          },
        });
      } else if (this.tableId == "Variables") {
        this.$router.push({
          name: this.detailRouteName,
          params: {
            resource: row.resource.id,
            dataset: row.dataset.name,
            name: row.name,
          },
        });
      } else if (this.tableId == "VariableMappings") {
        this.$router.push({
          name: this.detailRouteName,
          params: {
            toResource: row.toDataDictionary.resource.pid,
            toVersion: row.toDataDictionary.version,
            toTable: row.toTable.name,
            toVariable: row.toVariable.name,
            fromResource: row.fromDataDictionary.resource.pid,
            fromVersion: row.fromDataDictionary.version,
            fromTable: row.fromTable.name,
          },
        });
      } else if (this.tableId == "Publications") {
        this.$router.push({
          name: "Publications-details",
          params: {
            doi: row.doi,
          },
        });
      } else if (row.id) {
        this.$router.push({
          name: this.detailRouteName,
          params: { id: row.id },
        });
      } else if (row.name && row.resource) {
        this.$router.push({
          name: this.detailRouteName,
          params: { name: row.name, resource: row.resource.id },
        });
      }
    },
  },
  created() {
    this.reloadMetadata();
  },
};
</script>
