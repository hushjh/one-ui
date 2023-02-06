import Vue from "vue";
import { Component } from "vue-property-decorator";
import "./touchEmulator";
import { AnyObject } from "@/types";
import { bind } from "./event";
// import { bind, preventDefault } from "../modules/event";
const MIN_DISTANCE = 10;
function getDirection(x: number, y: number) {
  if (x > y && x > MIN_DISTANCE) {
    return "horizontal";
  }
  if (y > x && y > MIN_DISTANCE) {
    return "vertical";
  }
  return "";
}
@Component({
  name: "TouchMixins",
})
export default class TouchMixins extends Vue {
  appName = "bridge";
  maxTargetX = 150;
  maxTargetY = 150;
  startX = 0;
  startY = 0;
  deltaX = 0;
  deltaY = 0;
  offsetX = 0;
  offsetY = 0;
  direction = "";
  bindedEvents: {
    [propName: string]: AnyObject[];
  } = {
    unbindtouchstart: [],
    unbindtouchmove: [],
    unbindtouchend: [],
  };
  resetTouchStatus() {
    this.startY = 0;
    this.startX = 0;
    this.deltaY = 0;
    this.deltaX = 0;
    this.offsetX = 0;
    this.offsetY = 0;
    this.direction = "";
    this.bounceDeltaX = 0;
    this.bounceDeltaY = 0;
  }
  onTouchStart(e: Event, args: AnyObject) {
    // preventDefault(e, true);
    this.resetTouchStatus();
    const { start, target } = args;
    this.startX = (e as TouchEvent).touches[0].clientX;
    this.startY = (e as TouchEvent).touches[0].clientY;
    start && typeof start === "function" && start({ e, target }); // eslint-disable-line
  }
  onTouchMove(e: Event, args: AnyObject) {
    // preventDefault(e, true);
    const { dragging, target } = args;
    const itemHeight = (e.target as HTMLElement).offsetHeight;
    const touch = (e as TouchEvent).touches[0];
    this.deltaX = touch.clientX - this.startX;
    this.deltaY = touch.clientY - this.startY;
    const stepY = (this.maxTargetY - this.deltaY) / 8;
    const stepX = (this.maxTargetX - this.deltaX) / 8;
    if (stepY >= 0) {
      this.bounceDeltaY = this.deltaY + stepY;
    }
    if (stepX >= 0) {
      this.bounceDeltaX = this.deltaX + stepY;
    }
    this.offsetX = Math.abs(this.deltaX);
    this.offsetY = Math.abs(this.deltaY);
    this.direction = this.direction || getDirection(this.offsetX, this.offsetY);
    dragging && // eslint-disable-line
      typeof dragging === "function" && // eslint-disable-line
      dragging({ e, target, itemHeight });
  }
  onTouchEnd(e: Event, args: AnyObject) {
    // preventDefault(e, true);
    const { stop, target } = args;
    const itemHeight = ((e as TouchEvent).target as HTMLElement).offsetHeight;
    const scrollHeight = target.offsetHeight;
    stop && // eslint-disable-line
      typeof stop === "function" &&
      stop({ e, target, itemHeight, scrollHeight });
  }
  bindEvent(el: HTMLElement, args: AnyObject) {
    const unbindtouchstart = bind(
      el,
      "touchstart",
      this.onTouchStart,
      { ...args, target: el },
      false
    );
    const unbindtouchmove = bind(
      el,
      "touchmove",
      this.onTouchMove,
      { ...args, target: el },
      false
    );
    const unbindtouchend = bind(
      el,
      "touchend",
      this.onTouchEnd,
      { ...args, target: el },
      false
    );
    this.bindedEvents["unbindtouchstart"].push(unbindtouchstart);
    this.bindedEvents["unbindtouchmove"].push(unbindtouchmove);
    this.bindedEvents["unbindtouchend"].push(unbindtouchend);
  }
  unbindAllEvent() {
    for (const attr in this.bindedEvents) {
      while (this.bindedEvents[attr].length > 0) {
        const unbind = this.bindedEvents[attr].pop();
        if (typeof unbind === "function") {
          unbind();
        }
      }
    }
  }
  unbindEvent(type: string) {
    const unbind = `unbind${type}`;
    const event = this.bindedEvents[unbind];
    while (event.length > 0) {
      const e = event.pop();
      if (e && typeof e === "function") {
        e();
      }
    }
  }
}
