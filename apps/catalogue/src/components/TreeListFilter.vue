<template>
  <div>
    <IconAction :icon="expand ? 'caret-up' : 'caret-down'" @click="toggle" />
    <strong class="font-weight-bold">{{ value.name }}</strong>
    <div v-if="expand">
      <Spinner v-if="loading" />
      <div v-else class="ml-4" v-for="option in value.options">
        <input type="checkbox" v-model="option.checked" />
        {{ option[value.refColumnId] }}
      </div>
    </div>
  </div>
</template>

<script>
import { IconAction, Spinner } from "molgenis-components";
import { request } from "graphql-request";

export default {
  components: { IconAction, Spinner },
  props: {
    value: Object,
  },
  data() {
    return {
      expand: false,
      loading: false,
    };
  },
  computed: {
    active() {},
  },
  methods: {
    toggle() {
      if (this.value.options == undefined) {
        this.loading = true;
        request(
          "graphql",
          "{" + this.value.refTableId + "{" + this.value.refColumnId + "}}"
        )
          .then((data) => {
            this.value.options = data[this.value.refTableId];
          })
          .catch((error) => {
            this.graphqlError = error.response.errors[0].message;
          })
          .finally(() => {
            this.loading = false;
          });
      }
      this.expand = !this.expand;
    },
  },
};
</script>
