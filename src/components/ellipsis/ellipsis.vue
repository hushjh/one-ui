<template>
  <p class="ellipsis-wrap" ref="elWrap">
    <span ref="title" :class="className"></span>
    <slot name="titleEx"></slot>
  </p>
</template>
<script lang="ts">
import "./less/style.scss";
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
@Component({
  name: "Ellipsis",
})
export default class Ellipsis extends Vue {
  static componentName = "YnEllipsis";
  innerHtml = "";
  @Prop({ type: String, default: "" })
  title!: string;
  @Prop({ type: Number, default: 44 })
  offsetHeight!: number;
  @Prop({ type: String, default: "" })
  className!: string;

  @Watch("title")
  onTitle() {
    this.setEllips();
  }
  setEllips() {
    const moreEle = this.$refs.elWrap as HTMLElement;
    const nameEle = this.$refs.title as HTMLElement;
    const innerHtml = this.title;
    for (let i = 1; i <= innerHtml.length; i++) {
      nameEle.innerHTML = innerHtml.substr(0, i);
      if (moreEle.offsetHeight > this.offsetHeight) {
        nameEle.innerHTML = innerHtml.substr(0, i - 3) + " ... ";
        break;
      }
    }
  }
  mounted() {
    this.setEllips();
  }
}
</script>
