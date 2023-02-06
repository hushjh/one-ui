<template>
  <div class="ellipsis-page">
    <h2>自定义行数，超出省略</h2>
    <p class="ellipsis-item" v-for="(item, index) in hotelList" :key="index">
      <yn-ellipsis
        :title="item.hotelName"
        :offsetHeight="44"
        className="ellipsis-hotelname"
      >
        <template v-slot:titleEx>
          <span v-if="item.starText" class="star-text">{{
            item.starText
          }}</span>
        </template>
      </yn-ellipsis>
    </p>
  </div>
</template>
<script>
import "./style/index.scss";
export default {
  name: "YnEllipsisPage",
  data() {
    return {
      hotelList: [
        {
          hotelName: "武汉楚河汉界$weight:不推荐使用不带单位万豪大酒店",
          starText: "经济型",
        },
        {
          hotelName: "武汉楚河汉界万豪大酒店",
          starText: "经济型",
        },
        {
          hotelName: "武汉万豪大酒店",
          starText: "经济型",
        }
      ]
    };
  },
};
</script>

