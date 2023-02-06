<template>
  <div class="swipe-page">
    <h2>左右滑动</h2>
    <div class="swipe-box">
      <yn-swipe
        ref="swipe"
        :activeIndexProp="activeIndex - 1"
        @ticking="handleTicking"
        @moving="handleMoving"
      >
        <yn-swipe-item ref="swipeItem">
          <div class="content contnent--1">1</div>
        </yn-swipe-item>
        <yn-swipe-item ref="swipeItem">
          <div class="content contnent--2">2</div>
        </yn-swipe-item>
        <yn-swipe-item ref="swipeItem">
          <div class="content contnent--3">3</div>
        </yn-swipe-item>
      </yn-swipe>
    </div>
  </div>
</template>
<script>
import "./style/index.scss";
export default {
  name: "YnEllipsisPage",
  data() {
    return {
      activeIndex: 1
    };
  },
  methods: {
    handleMoving(option) {
      const { dir, size, value } = option;
    console.log("dir:", dir, "size:", size, "value:", value);

  },
  handleTicking(option) {
    console.log("handleTicking, option:", option);
    const { activeIndex } = option;
    this.activeIndex = activeIndex;
  }
  }
};
</script>

