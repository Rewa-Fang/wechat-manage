<template>
  <div class="sync-progress" v-show="show">
    <div class="progress-box">
      <div class="title">{{ now == total?'同步成功！':text }}</div>
      <div class="progress-div">
        <div class="progress-bar" :style="{width:progNum}">
          <i class="el-icon-success" v-show="now == total"></i>
        </div>
      </div>
      <div class="progress-num">{{ now }}/{{ total}}</div>
      <div class="progress-btn">
        <button class="close-btn" @click="close">{{ now == total?'关 闭':'取 消' }}</button>
      </div>
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
    },
    progWidth:{
      type: Number,
      default: 0
    }
  },
  data() {
    return {
    };
  },
  computed: {
    progNum() {
      return Math.round((this.now / this.total)*100) + "%";
    }
  },
  methods: {
    close() {
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
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.progress-box {
  text-align: left;
  background-color: rgb(240, 240, 240);
  width: 420px;
  border-radius: 3px;
  font-size: 16px;
  overflow: hidden;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  color: #48576a;
}
.title {
  font-weight: bold;
  padding: 10px;
  text-align: center;
  font-size: 20px;
}
.progress-div {
  margin: 10px;
  background-color: #fff;
  border-radius: 4px;
  overflow: hidden;
}
.progress-bar {
  /* width: 1%; */
  height: 24px;
  background-color: #409eff;
  border-radius: 4px 0 0 4px;
  color: #fff;
}
.progress-num {
  padding: 4px;
  text-align: center;
}
.progress-btn {
  padding: 6px;
  text-align: right;
}
.close-btn {
  background-color: #f56c6c;
  color: #fff;
  padding: 6px 15px;
  border-radius: 4px;
  white-space: nowrap;
  cursor: pointer;
}
</style>