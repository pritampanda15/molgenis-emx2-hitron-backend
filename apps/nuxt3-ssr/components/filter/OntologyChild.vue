<script setup>
import { ref } from "vue";

const props = defineProps({
  title: {
    type: String,
  },
  visible: {
    type: Boolean,
    default: true,
  },
  items: {
    type: Array,
  },
});

const emit = defineEmits(["select", "deselect"]);

var itemMap = props.items.reduce(function (map, obj) {
  map[obj.name] = obj;
  return map;
}, {});

let terms = reactive(itemMap);

let key = ref(1);
function toggleExpand(term) {
  terms[term.name].expanded = !terms[term.name].expanded;
  key++;
}

function toggleSelect(term) {
  //if selecting then also expand
  //if deselection we keep it open
  if (term.selected == "complete") {
    emit("deselect", term.name);
  } else {
    emit("select", term.name);
  }
}
</script>

<template>
  <div>
    <li v-for="child in items" :key="child.name" class="mt-2.5 relative">
      <span class="flex items-center">
        <span
          v-if="child.children"
          @click="toggleExpand(child)"
          class="-left-[11px] top-0 text-search-filter-group-toggle rounded-full hover:bg-search-filter-group-toggle hover:cursor-pointer h-6 w-6 flex items-center justify-center absolute z-20"
        >
          <BaseIcon name="caret-up" :width="20" />
        </span>
        <BaseIcon
          v-if="child.children"
          name="collapsible-list-item-sub"
          :width="20"
          class="text-blue-200 absolute -top-[9px]"
        />
        <BaseIcon
          v-else
          name="collapsible-list-item"
          :width="20"
          class="text-blue-200 absolute -top-[9px]"
        />
      </span>
      <div class="flex items-start ml-3">
        <div class="flex items-center">
          <input
            type="checkbox"
            :id="child.name"
            :name="child.name"
            @click.stop="toggleSelect(child)"
            :checked="
              child.selected === 'complete' || child.selected === 'partial'
            "
            class="w-5 h-5 rounded-3px ml-2.5 mr-2.5 mt-0.5 text-search-filter-group-checkbox border border-checkbox"
          />
        </div>
        <label
          :for="child.name"
          class="hover:cursor-pointer text-body-sm group"
        >
          <span class="group-hover:underline">{{ child.name }}</span>
          <div class="inline-flex items-center whitespace-nowrap">
            <!-- <span
              v-if="child?.children?.length"
              class="inline-block mr-2 text-blue-200 group-hover:underline decoration-blue-200"
            >
              &nbsp;- {{ child.children.length }}
            </span> -->
            <div class="inline-block">
              <CustomTooltip
                v-if="child.description"
                label="Description"
                hoverColor="white"
                :content="child.description"
              />
            </div>
          </div>
        </label>
      </div>
      <ul
        v-if="child.children"
        :class="{ hidden: !terms[child.name].expanded }"
        class="ml-[31px]"
      >
        <FilterOntologyChild
          :key="key"
          :items="child.children"
          @select="$emit('select', $event)"
          @deselect="$emit('deselect', $event)"
        />
      </ul>
    </li>
  </div>
</template>
