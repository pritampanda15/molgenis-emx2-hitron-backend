<template>
  <div class="card">
    <div class="card-body" @click="$emit('click', row)">
      <div class="card-text">
        <span class="float-right">
          <RowButton
            v-if="canEdit"
            type="edit"
            class="d-inline"
            :tableId="tableId"
            :pkey="getKey(row)"
            @close="$emit('reload')"
            @edit="$emit('edit', row)"
          />
          <RowButton
            v-if="canEdit"
            type="delete"
            class="mt-0"
            :tableId="tableId"
            :pkey="getKey(row)"
            @close="$emit('reload')"
            @delete="$emit('delete', row)"
          />
        </span>
        <VueTemplate v-if="template" :template="template" :row="row" />
        <dl v-else>
          <template v-for="col in columns" :key="col.id">
            <template v-if="showItem(row, col)">
              <dt v-if="showItem(row, col)" class="pr-3 pb-1">
                {{ col.label }}
              </dt>
              <dd class="pl-3" v-if="showItem(row, col)">
                <RenderValue :col="col" :row="row" />
              </dd>
            </template>
          </template>
        </dl>
      </div>
    </div>
  </div>
</template>

<style scoped>
dl {
  width: 100%;
  overflow: hidden;
}

dt {
  float: left;
  width: 35%;
  text-align: right;
  clear: both;
}

dd {
  float: left;
  width: 65%;
  /* adjust the width; make sure the total of both is 100% */
  padding: 0;
  margin: 0;
}
</style>

<script>
import RenderValue from "./RenderValue.vue";
import RowButton from "./RowButton.vue";
import VueTemplate from "../layout/VueTemplate.vue";

export default {
  components: {
    RenderValue,
    RowButton,
    VueTemplate,
  },
  props: {
    columns: Array,
    tableId: String,
    row: Object,
    template: String,
    canEdit: Boolean,
  },
  methods: {
    getKey(row) {
      let result = {};
      this.columns
        .filter((c) => c.key == 1)
        .map((c) => (result[c.id] = row[c.id]));
      return result;
    },
    showItem(row, col) {
      return col.showColumn && row[col.id] && col.id != "mg_tableclass";
    },
  },
};
</script>
