import { AnyObject } from "@/types";

const passiveSupported = false;
export const bind = (
  dom: HTMLElement,
  type: string,
  fn: (e: Event, args: AnyObject) => void,
  args: AnyObject,
  passive = true
) => {
  const callback = function (this: any, e: Event) {
    fn.call(this, e, args);
  };
  dom.addEventListener(
    type,
    callback,
    passiveSupported ? { passive, capture: false } : false
  );
  return () => {
    off(dom, type, callback);
  };
};
// https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener
export const on = (
  dom: EventTarget,
  type: string,
  fn: () => void,
  passive = true
) => {
  dom.addEventListener(
    type,
    fn,
    passiveSupported ? { passive, capture: false } : false
  );
};

export const off = (dom: EventTarget, type: string, fn: (e: Event) => void) => {
  dom.removeEventListener(type, fn);
};

export const stopPropagation = (event: Event) => {
  event && // eslint-disable-line
    typeof event.stopPropagation === "function" &&
    event.stopPropagation();
};
export const preventDefault = (event: Event, isStopPropagation = false) => {
  if ((event && typeof event.cancelable !== "boolean") || event.cancelable) {
    event.preventDefault();
  }
  if (isStopPropagation) {
    stopPropagation(event);
  }
};
