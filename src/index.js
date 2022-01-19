import Dialog from "./components/dialog";
import Popover from "./components/popover";

export const componentList = {
  Dialog,
  Popover
}

const install = (Vue) => {
  Object.keys(componentList).map(key => {
    const comp = componentList[key];
    Vue.component(comp.name, comp);
  });
};
export default {
  install
}