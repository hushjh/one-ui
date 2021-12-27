<template>
  <div class="example-container">
    <ul>
        <li @click="jump('dialog')">dialog</li>
        <li @click="jump('toast')">toast</li>
        <li @click="jump('calendar')">calendar</li>
        <li @click="jump('cityPicker')">cityPicker</li>
        <li @click="jump('datePicker')">datePicker</li>
      </ul>
  </div>
</template>
<script type="text/javascript">
export default {
  name: "Content",
  methods: {
    jump(name = "") {
      this.$router.push({ name });
    }
  }
};
</script>
