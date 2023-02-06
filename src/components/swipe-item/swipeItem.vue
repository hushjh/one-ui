<template>
  <div
    ref="swipeItem"
    class="swipe-item"
    :style="{ width: `${width}px`, height: `${height}px` }"
  >
    <slot></slot>
  </div>
</template>
<script lang="ts">
import "./less/style.scss";
import Vue from "vue";
import { Component } from "vue-property-decorator";
// import Vue from "vue/types";
@Component({
  name: "SwipeItem",
})
export default class SwipeItem extends Vue {
  static componentName = "YnSwipeItem";

  get width() {
    const { width } = this.$parent;
    return width;
  }
  get height() {
    const { height } = this.$parent;
    return height;
  }
  get index() {
    return this.$parent.$children.indexOf(this);
  }
  bind() {
    // if (!this.$parent || this.$parent.$children.indexOf(this) !== -1) {
    //   return;
    // }
    // const children = [...this.$parent.$children, this];
    // this.$parent.children = children;
  }
  mounted() {
    this.bind();
  }
  beforeDestroy() {
    // if (this.$parent) {
    //   this.$parent.children = this.$parent.children.filter(
    //     (item: Vue) => item !== this
    //   );
    // }
  }
}
</script>
