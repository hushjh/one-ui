<template>
  <span
    class="el-popover__wrapper"
  >
    <div
      class="el-popover"
      ref="popover"
      v-show="visible"
      :style="style"
    >
      <div class="el-popover__content">
        <slot>
          <span>这是popover弹框,这是popover弹框,这是popover弹框</span>
        </slot>
      </div>
    </div>
    <span
      class="el-reference"
      ref="reference"
    >
      <slot name="reference"></slot>
    </span>
  </span>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Mixins, Prop, Watch  } from "vue-property-decorator";
import "./style/index.scss";
import { AnyObject } from "@/types";
import { on, off } from "@/utils/dom";
import PupupManager from "@/utils/popup/popupManger";
const stop = (e: Event) => e.stopPropagation();

@Component({
  name: "Popover"
})
export default class Dialog extends Vue {
  visible = false;
  arrowAppended = false;
  @Prop({
    type: Number,
    default: 0
  })
  width!: number;
  @Prop({
    type: String,
    default: "bottom"
  })
  placement!: string; // "top", "bottom", "left", "right"
  @Prop({
    type: String,
    default: "click"
  })
  trigger!: string
  get style() {
    const style: AnyObject = {};
    if (this.width) style.width = this.width + "px";
    return style;
  }
  @Watch("visible")
  onVisible(n: boolean) {
    if (n) {
      this.updatePop();
      this.$nextTick(() => {
        this.updatePop();
      });
    }
  }
  toggle() {
    this.visible = !this.visible;
  }
  getPopRect(domPop: HTMLElement) {
    if (!domPop) return new DOMRect();
    // let _display = domPop.style.display;
    // let _visibility = domPop.style.visibility; 
    // domPop.style.display = "block"
    // domPop.style.visibility = "hidden";
    const rectPop = domPop.getBoundingClientRect();
    // domPop.style.display = _display;
    // domPop.style.visibility = _visibility;
    return rectPop;
  }
  appendArrow(ele: HTMLElement) {
    if (this.arrowAppended) return;
    const arrow = document.createElement("div");
    arrow.setAttribute("class", "popper__arrow");
    ele.appendChild(arrow);
    this.arrowAppended = true;
  }
  setPopPosition() {
    const domReference: HTMLElement = this.$refs.reference as HTMLElement;
    const domPop: HTMLElement = this.$refs.popover as HTMLElement;
    const rectReference = domReference.getBoundingClientRect();
    const rectPop = this.getPopRect(domPop);
    switch(this.placement) {
      case "top": {
        domPop.style.top = -rectPop.height + "px";
        domPop.style.left = (rectReference.width - rectPop.width) / 2 + "px";
        domPop.style.marginTop = "-12px";
        domPop.setAttribute("x-placement", "top");
        break;
      }
      case "bottom": {
        domPop.style.top = rectReference.height + "px";
        domPop.style.left = (rectReference.width - rectPop.width) / 2 + "px";
        domPop.style.marginTop = "12px";
        domPop.setAttribute("x-placement", "bottom");
        break;
      }
      case "left": {
        domPop.style.top = (rectReference.height - rectPop.height) / 2 + "px";
        domPop.style.left = -rectPop.width + "px";
        domPop.style.marginLeft = "-12px";
        domPop.setAttribute("x-placement", "left");
        break;
      }
      case "right": {
        domPop.style.top = (rectReference.height - rectPop.height) / 2 + "px";
        domPop.style.left = rectReference.width + "px";
        domPop.style.marginLeft = "12px";
        domPop.setAttribute("x-placement", "right");
        break;
      }
    }
    this.appendArrow(domPop);
    on(domPop, "click", stop);
    domPop.style.zIndex = PupupManager.nextZIndex();
  }
  updatePop() {
    this.setPopPosition();
  }
  handleDocumentClick(e: Event) {
    const domPop = this.$refs.popover as HTMLElement;
    const domReference = this.$refs.reference as HTMLElement;
    const target = e.target as HTMLElement;
    if (!this.$el || this.$el.contains(target) ||
      !domPop || domPop.contains(target) ||
      !domReference || domReference.contains(target)) {
        // 外部点击事件传入 popover，则popover组件不做任何处理
      return;
    } else {
      this.visible = false;
    }
  }
  handleMouseEnter() {
    this.visible = true;
  }
  handleMouseLeave() {
    this.visible = false;
  }
  handleResize() {
    this.updatePop();
  }
  mounted() {
    let reference = this.$refs.reference as HTMLElement;
    let poper = this.$refs.popover as HTMLElement;
    switch(this.trigger) {
      case "click": {
        on(reference, "click", this.toggle);
        on(document, "click", this.handleDocumentClick);
        break;
      }
      case "hover": {
        on(reference, "mouseenter", this.handleMouseEnter);
        on(poper, "mounseenter", this.handleMouseEnter);
        on(reference, "mouseleave", this.handleMouseLeave);
        on(poper, "mounseleave", this.handleMouseLeave);
        break;
      }
    }
    on(document, "resize", this.handleResize)
  }
  beforeDestroy() {
    let reference = this.$refs.reference as HTMLElement;
    off(reference, "click", this.toggle);
    off(document, "click", this.handleDocumentClick);
    off(document, "resize", this.handleResize)
  }
}
</script>