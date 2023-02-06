<template>
  <div class="yn-swipe">
    <div
      :style="{ width: `${this.width}px` }"
      class="yn-swipe-list-container"
      ref="swipeContainer"
    >
      <slot></slot>
    </div>
  </div>
</template>
<script lang="ts">
import "./less/style.scss";
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { AnyObject } from "@/types";
// import Vue from "vue/types";
import { EventBus } from "@/utils/eventBus";
import { preventDefault } from "./mixins/event";
import { move } from "./mixins/move";
import Remainder from "@/components/swipe/mixins/remainder";
import touchMixins from "@/components/swipe/mixins/touch";
@Component({
  name: "Swipe",
  mixins: [touchMixins],
})
export default class Swipe extends Vue {
  static componentName = "YnSwipe";
  appName = "bridge";
  height = 240;
  rect: AnyObject = {};
  width = 0;
  count = 0;
  timer!: number;
  activedIndex = 0;
  delayActivedIndex = 0;
  moving = false;
  dragging = false;
  @Prop({
    type: Number,
    default: 0,
  })
  activeIndexProp!: number;
  @Prop({
    type: Boolean,
    default: false,
  })
  vertical!: boolean;
  get size() {
    return this.vertical ? this.height : this.width;
  }
  @Watch("activeIndexProp", {
    immediate: true,
  })
  onActiveIndexProp(n: number) {
    this.activedIndex = n;
  }
  initialize() {
    if (this.$el) {
      this.rect = this.$el.getBoundingClientRect();
      this.width = Math.round(this.rect.width);
      this.height = Math.round(this.rect.height);
    }
    this.$emit("ticking", {
      length: this.$children.length,
      activeIndex: this.activedIndex + 1,
    });
    const attr = this.vertical ? "top" : "left";
    this.$children.forEach((child: Vue, key: number) => {
      if (key === this.activedIndex) {
        (child.$el as HTMLElement).style[attr] = "0px";
      } else {
        (child.$el as HTMLElement).style[attr] = `${this.size}px`;
      }
    });
    // this.play();
  }
  drag() {
    const el = this.$refs.swipeContainer;
    if (!el) {
      return;
    }
    let prevEle: HTMLElement | null;
    let curEle: HTMLElement | null;
    let num = 1;
    let nextEle: HTMLElement | null;
    let moving = false;
    const that = this; // eslint-disable-line
    let r: any = null;
    let startTime = 0;
    this.bindEvent(el, {
      start() {
        that.dragging = true;
        startTime = Date.now();
      },
      dragging(e: AnyObject) {
        if (
          (that.direction !== "vertical" && !that.vertical) ||
          (that.direction !== "horizontal" && that.vertical)
        ) {
          preventDefault(e.e, true);
        }
        if (moving) {
          return;
        }
        if (!r) {
          if (
            (!that.vertical && that.deltaX < 0) ||
            (that.vertical && that.deltaY < 0)
          ) {
            if (that.activedIndex + 1 === that.R.remainder) {
              // 最右边 不允许左滑
              return;
            }
            r = that.R.next();
            num = 1;
          } else if (
            (!that.vertical && that.deltaX > 0) ||
            (that.vertical && that.deltaY > 0)
          ) {
            if (that.activedIndex === 0) {
              // 最左边不允许右滑
              return;
            }
            r = that.R.previous();
            num = -1;
          } else {
            return;
          }
        }
        const attr = that.vertical ? "top" : "left";
        const value = that.vertical ? that.deltaY : that.deltaX;
        prevEle = that.$children[r.getPrevious()].$el as HTMLElement;
        curEle = that.$children[r.getIndex()].$el as HTMLElement;
        nextEle = that.$children[r.getNext()].$el as HTMLElement;
        (prevEle as HTMLElement).style[attr] = `${value}px`;
        (curEle as HTMLElement).style[attr] = `${num * that.size + value}px`;
        that.$emit("moving", {
          dir: num,
          size: that.size,
          value: Math.abs(value),
        });
      },
      stop(e: AnyObject) {
        that.dragging = false;
        that.delayActivedIndex = that.activedIndex;
        that.$emit("ticking", {
          activeIndex: that.activedIndex + 1,
          length: that.$children.length,
        });
        const disXY = that.vertical ? that.deltaY : that.deltaX;
        const timeDiff = Date.now() - startTime;
        if (timeDiff < 200 && disXY === 0) {
          // preventDefault(e.e, true);
          that.$emit("click", that.activedIndex);
          return;
        }
        if (moving || disXY === 0 || !prevEle || !curEle || !nextEle) {
          return;
        }
        const attr = that.vertical ? "top" : "left";
        moving = true;
        that.startMove(prevEle, disXY, -1 * num * that.size - disXY);
        curEle.style[attr] = `${num * that.size + disXY}px`;
        nextEle.style[attr] = `${num * that.size}px`;
        that.startMove(
          curEle,
          num * that.size + disXY,
          -1 * num * that.size - disXY,
          () => {
            moving = false;
            prevEle = null;
            curEle = null;
            nextEle = null;
            r = null;
          }
        );
      },
    });
  }
  startMove(el: HTMLElement, b = 0, c = 0, fn?: (el: HTMLElement) => void) {
    const { vertical } = this;
    const attr = vertical ? "top" : "left";
    move(el, { attr, b, c }, (el: HTMLElement) => {
      fn && typeof fn === "function" && fn.call(this, el); // eslint-disable-line
    });
  }
  next() {
    this.updateActivedIndex(1, () => {
      return;
    });
  }
  prev() {
    this.updateActivedIndex(-1, () => {
      return;
    });
  }
  updateActivedIndex(num: number, callback: (el: HTMLElement) => void) {
    if (!this.$children || this.$children.length === 0) return;
    // 正在运动的时候不允许连续点击
    if (this.moving) {
      return false;
    }
    this.moving = true;
    let r;
    const isPositive = num > 0;
    if (isPositive) {
      r = this.R.next(num);
    } else {
      r = this.R.previous(Math.abs(num));
    }
    this.delayActivedIndex = this.activedIndex;
    this.$emit("ticking", {
      length: this.$children.length,
      activeIndex: this.activedIndex + 1,
    });
    const prevEle = this.$children[r.getPrevious()].$el as HTMLElement;
    const curEle = this.$children[r.getIndex()].$el as HTMLElement;
    const nextEle = this.$children[r.getNext()].$el as HTMLElement;
    const attr = this.vertical ? "top" : "left";
    const transferNum = num / Math.abs(num);
    this.startMove(prevEle, 0, -1 * transferNum * this.size);
    curEle.style[attr] = `${transferNum * this.size}px`;
    this.startMove(
      curEle,
      transferNum * this.size,
      -1 * transferNum * this.size,
      (el) => {
        this.moving = false;
        callback && typeof callback === "function" && callback(el); // eslint-disable-line
      }
    );
    nextEle.style[attr] = `${transferNum * this.size}px`;
  }
  mounted() {
    this.count = this.$children.length;
    this.R = new Remainder(this.count, "activedIndex", this);
    this.initialize();
    EventBus.$on("window:resize", () => {
      this.initialize();
    });
    this.drag();
  }
}
</script>
