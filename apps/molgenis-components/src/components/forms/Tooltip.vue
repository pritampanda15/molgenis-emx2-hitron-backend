<template>
  <span
    class="mg-tooltip-container"
    @mouseenter="showTooltip"
    @mouseleave="destroyTooltip"
    ref="tooltipContainer"
  >
    <slot />
    <div ref="toolTip" v-if="value && display">
      <div class="mg-tooltip m-1">
        {{ value }}
      </div>
    </div>
  </span>
</template>

<style>
/** https://www.w3schools.com/css/css_tooltip.asp */
.mg-tooltip {
  background-color: #555;
  color: #fff;
  border-radius: 6px;
  padding: 5px;
  display: inline-block;
  opacity: 0.8;
}
</style>

<script>
import { createPopper } from "@popperjs/core";

export default {
  props: {
    /** the value of the tooltip. If left empty no tooltip is rendered */
    value: String,
    /** placement of the tooltip conform popperjs. Also determines where the tooltip will stick in case screen is too small.
     * See https://popper.js.org/docs/v1/#popperplacements--codeenumcode
     */
    placement: { type: String, default: "auto-end" },
  },
  data() {
    return {
      popperInstance: null,
      display: false,
    };
  },
  methods: {
    async showTooltip() {
      this.display = true;
      await this.$nextTick();
      const container = this.$refs["tooltipContainer"];
      const tooltip = this.$refs["toolTip"];
      if (container && tooltip) {
        this.popperInstance = createPopper(container, tooltip, {
          strategy: "fixed",
          placement: this.placement,
        });
      }
    },
    async destroyTooltip() {
      this.popperInstance?.destroy();
      this.display = false;
    },
  },
};
</script>

<docs>
<template>
  <demo-item>
    <Tooltip value="this is quite a long tooltip so we can test that it actually renders with prevent overflow">
      <IconAction icon="trash" @click="window.alert('clicked')"/>
    </Tooltip>
  </demo-item>
  <demo-item>
    <Tooltip :value="undefined">
      <IconAction icon="trash" @click="window.alert('clicked')"/> 
      Button with empty tooltip
    </Tooltip>
  </demo-item>
</template>
</docs>
