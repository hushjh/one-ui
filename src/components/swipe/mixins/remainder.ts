const getData = function (this: any, attr: string) {
  return this[attr];
};
const setData = function (this: any, attr: string, value: any) {
  this[attr] = value;
};
export default class Remainder {
  dir!: number;
  i!: number | string;
  hasContext!: boolean;
  context!: any;
  remainder!: any;
  attr!: string;
  constructor(r: any, i: string, context: any) {
    this.remainder = r;
    this.dir = 1;
    if (context && Object.prototype.hasOwnProperty.call(context, i)) {
      this.i = getData.call(context, i);
      this.attr = i;
      this.context = context;
      this.hasContext = true;
    } else {
      this.i = i || 0;
      this.hasContext = false;
    }
  }
  next(num = 1) {
    this.dir = 1;
    this.i = this.getNext("absolute", num);
    if (this.hasContext) {
      setData.call(this.context, this.attr, this.i);
    }
    return this;
  }
  previous(num = 1) {
    this.dir = -1;
    this.i = this.getPrevious("absolute", num);
    if (this.hasContext) {
      setData.call(this.context, this.attr, this.i);
    }
    return this;
  }
  getIndex() {
    return this.i;
  }
  getPrevious(pos: string, num = 1) {
    let index = this.i as number;
    if (pos === "absolute") {
      index = (index - num) % this.remainder;
      index = index >= 0 ? index : index + this.remainder;
    } else {
      if (this.dir > 0) {
        // 向做滑动 当前元素上一个
        index = index === 0 ? this.remainder - 1 : index - 1;
      } else {
        // 右滑动 当前元素上一个
        index = (index + 1) % this.remainder;
      }
    }
    return index;
  }
  getNext(pos: string, num = 1) {
    let index = this.i as number;
    if (pos === "absolute") {
      index = (index + num) % this.remainder;
    } else {
      if (this.dir > 0) {
        // 向左滑动 当前元素下一个
        index = (index + 1) % this.remainder;
      } else {
        // 向右滑动 当前元素下一个
        index =
          index - 1 >= 0 ? index - 1 : (this.remainder - 1) % this.remainder;
      }
    }
    return index;
  }
}
