<template>
  <div class="sync-progress" v-show="show">
    <h1>{{ text }}</h1>
    <div>{{ now }}/{{ total}}</div>
    <!-- <button @click="close">X</button> -->
  </div>
</template>

<script>
export default {
  props: {
    show: Boolean,
    text: {
      type: String,
      default: "正在加载中..."
    },
    now:{
      type:Number,
      default:1
    },
    total:{
      type:Number,
      default:1
    }
  }
};
</script>

<style scoped>
.sync-progress{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  text-align: center;
}
</style>