<template>
  <div>
    <el-pagination background :page-size="pagiConfig.pageSize" :pager-count="pagiConfig.pagerCount" @current-change="handleCurrentChange" layout="prev, pager, next, jumper, total" :total="pagiConfig.totalCount">
    </el-pagination>
  </div>
</template>

<script>
export default {
  props:['pagiConfig'],
  data() {
    return {
      // pagiConfig:{
      //   pageSize:15,
      //   pagerCount:7,
      //   total:1000
      // }
    };
  },
  created() {
  },
  methods: {
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.$emit('changePage',val);
    }
  }
};
</script>
<style>
.el-pagination{
  text-align: center;
}
.btn-prev,
.btn-next,
.el-pager li {
  border: 0;
  margin: 0 5px;
  background-color: #f4f4f5;
  color: #606266;
  min-width: 30px;
  border-radius: 2px;
}
.el-pagination .btn-next,
.el-pagination .btn-prev {
  background-color: #f4f4f5;
  border: 0;
  cursor: pointer;
  margin: 0 5px;
  color: #606266;
}
.el-pager li:last-child {
  border-right: 0;
}
</style>