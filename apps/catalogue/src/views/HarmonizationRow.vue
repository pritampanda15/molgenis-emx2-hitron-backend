<template>
  <tr>
    <th class="table-label text-nowrap" scope="row">
      {{ variable.name }}
    </th>
    <harmonization-cell
      v-for="resource in resources"
      :key="resource.id"
      class="colored-grid-cell"
      :status="getCellClass(resource)"
    />
  </tr>
</template>

<script>
import HarmonizationCell from "../components/harmonization/HarmonizationCell.vue";

export default {
  name: "HarmonizationRow",
  components: { HarmonizationCell },
  props: {
    variable: Object,
    resources: Array,
  },
  data() {
    return {
      resourceStatusMap: undefined,
    };
  },
  computed: {
    resourceMappings() {
      return this.variable?.mappings;
    },
  },
  methods: {
    getCellClass(cohort) {
      return this.resourceMappings ? this.getMatchStatus(cohort) : null;
    },
    getMatchStatus(resource) {
      if (this.variable.repeats && Array.isArray(this.resourceMappings)) {
        const statusList = this.variable.repeats.map((repeatedVariable) => {
          const resourceMapping = this.resourceMappings.find((mapping) => {
            return (
              mapping.targetVariable &&
              mapping.targetVariable.name === repeatedVariable.name &&
              mapping.source.id === resource.id
            );
          });

          return resourceMapping ? resourceMapping.match.name : "na";
        });

        const baseVariable = this.resourceMappings.find((mapping) => {
          return (
            mapping.targetVariable &&
            mapping.targetVariable.name === this.variable.name &&
            mapping.source.id === resource.id
          );
        });

        if (baseVariable) {
          statusList.push(baseVariable.match.name);
        }
        // If all repeats have a mapping and there are no 'NAs', variable is 'complete'
        if (!statusList.includes("na")) {
          return "complete";
          // If some repeats have a mapping but there are 'NAs', variable is 'partial'
        } else if (
          statusList.includes("partial") ||
          statusList.includes("complete")
        ) {
          return "partial";
          // Unmapped when no repeats have a mapping (only NAs)
        } else {
          return "unmapped";
        }
      } else if (Array.isArray(this.resourceMappings)) {
        const resourceMapping = this.resourceMappings.find((mapping) => {
          return mapping.source.id === resource.id;
        });

        if (!resourceMapping) {
          return "danger";
        }

        switch (resourceMapping.match.name) {
          case "na":
            return "unmapped";
          case "partial":
            return "complete";
          case "complete":
            return "complete";
          default:
            return "unmapped";
        }
      }
    },
  },
};
</script>

<style scoped>
.table-label {
  font-size: 0.8rem;
}

.table-bordered th,
.table-bordered td {
  border: 1px solid #6c757d;
}
</style>
