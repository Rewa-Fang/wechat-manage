<template>
  <div class="sync-progress" v-show="show">
    <div class="progress-box">
      <div>{{ text }}</div>
      <div class="progress-div">
        <div class="progress-bar"></div>
      </div>
      <div>{{ now }}/{{ total}}</div>
      <button class="close-btn" @click="close">取 消</button>
    </div>
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
    now: {
      type: Number,
      default: 1
    },
    total: {
      type: Number,
      default: 1
    }
  },
  methods:{
    close(){
      this.show = false;
    }
  }
};
</script>

<style scoped>
.sync-progress {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  background-color:rgba(0, 0, 0, .5);
}
.progress-box {
  
}
</style>