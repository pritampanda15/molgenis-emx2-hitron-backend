<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: string;
    mobileDisplay?: boolean;
    placeholder?: string;
  }>(),
  {
    mobileDisplay: false,
    placeholder: "Type to search..",
  }
);

let searchString = ref(props.modelValue);

const emit = defineEmits(["update:modelValue"]);

function submitSearch() {
  emit("update:modelValue", searchString);
}

let timeout: number | NodeJS.Timeout | undefined = undefined;
function handleInput(input: string) {
  searchString.value = input;
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    submitSearch();
  }, 500);
}
</script>
<template>
  <form class="relative" @submit.prevent="submitSearch">
    <input
      type="search"
      :value="searchString"
      @input="(event) => handleInput((event.target as HTMLInputElement).value)"
      class="w-full pr-16 font-sans text-black text-gray-300 bg-white outline-none rounded-search-input h-10 ring-red-500 pl-3 shadow-search-input focus:shadow-search-input hover:shadow-search-input"
      :class="`border-search-input${
        mobileDisplay ? '-mobile border' : ' focus:border-white'
      }`"
      :placeholder="placeholder"
    />
    <button
      class="rounded-search-button text-black absolute top-0 right-0 flex items-center pl-8 pr-6 tracking-wider text-search-button border-search-button border-[1px] transition-colors bg-search-button h-10 font-display text-heading-xl hover:text-search-button-hover"
    >
      Search
    </button>
  </form>
</template>
