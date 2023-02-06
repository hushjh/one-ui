import { AnyObject } from "@/types";
const easeOut = (t: number, b: number, c: number, d: number) => {
  return -c * ((t = t / d - 1) * t * t * t - 1) + b;
};
export const move = (
  obj: HTMLElement,
  json: AnyObject,
  fn: (el: HTMLElement) => void
) => {
  let t = 0;
  const b = json.b;
  const c = json.c;
  const d = 40;
  let timer!: number;
  cancelAnimationFrame(timer);
  const run = () => {
    const value = Math.ceil(easeOut(t, b, c, d));
    obj.style[json["attr"]] = `${value}px`;
    if (t < d) {
      t++;
      timer = requestAnimationFrame(run);
    } else {
      cancelAnimationFrame(timer);
      fn && typeof fn === "function" && fn(obj);
    }
  };
  run();
};
