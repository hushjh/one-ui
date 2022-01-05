<template>
  <div class="popover-page">
    <h3>基础用法</h3>
    <Popover
      :visible.sync="popoverVisible1"
      :width="200"
    >
      <template v-slot:reference>
        <button >click激活,下边展示</button>
      </template>
    </Popover>
    <Popover
      :visible.sync="popoverVisible2"
      :placement="'top'"
    >
      <template v-slot:reference>
        <button >click激活,上边展示</button>
      </template>
    </Popover>
    <Popover
      :visible.sync="popoverVisible3"
      :width="200"
      :placement="'left'"
    >
      <template v-slot:reference>
        <button >click激活,左边展示</button>
      </template>
    </Popover>
    <Popover
      :visible.sync="popoverVisible4"
      :width="200"
      :placement="'right'"
    >
      <template v-slot:reference>
        <button >click激活,右边展示</button>
      </template>
    </Popover>
    <Popover
      :visible.sync="popoverVisible5"
      :width="200"
      :placement="'top'"
      :trigger="'hover'"
    >
      <template v-slot:reference>
        <button >hover激活,上边展示</button>
      </template>
    </Popover>
    <div style="position: positive">a</div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import "./style/index.scss";
import { Component } from "vue-property-decorator";
import Popover from "@/components/popover";
@Component({
  name: "popoverPage",
  components: {
    Popover
  }
})
export default class ExDialog extends Vue {
  popoverVisible1 = false;
  popoverVisible2 = false;
  popoverVisible3 = false;
  popoverVisible4 = false;
  popoverVisible5 = false;
}
</script>