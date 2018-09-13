<template>
  <div class="fans-list">
    <el-row class="fans-title">
      粉丝管理
    </el-row>
    <el-table :data="fansList.List" style="width: 100%" class="user-table">
      <el-table-column label="头像" width="100">
        <template slot-scope="scope">
          <img :src="scope.row.HeadImgUrl" alt="" class="head-img">
        </template>
      </el-table-column>
      <el-table-column prop="NickName" label="昵称" width="300">
      </el-table-column>
      <el-table-column prop="City" label="城市">
      </el-table-column>
      <el-table-column label="订阅时间">
        <template slot-scope="scope">
          <div>
            {{ scope.row.SubscribeTime | dateFormatString}}
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- pagination -->
    <my-pagination :pagiConfig="mediaConfig" @changePage="changePage" v-if="mediaConfig.totalCount > 0"></my-pagination>
  </div>
</template>

<script>
import { postActionHandler } from "@/api/getData";
import pagination from "@/components/media/pagination";
import dateFormat from "@/filters/dateFormat";
export default {
  components: {
    myPagination: pagination
  },
  data() {
    return {
      mediaConfig: {
        type: 1,
        pageSize: 20,
        pagerCount: 7,
        verification: "",
        totalCount: 0, // 本地服务器素材总数
        wxTotalCount: 0 // 微信服务器素材总数
      },
      fansList: {},
      pageParam: {
        PageSize: 20,
        PageNumber: 0
      }
    };
  },
  filters: {
    dateFormatString(timestamp) {
      return dateFormat(timestamp);
    }
  },
  created() {
    if (localStorage.adminInfo) {
      this.userInfo = JSON.parse(localStorage.adminInfo);
      this.mediaConfig.verification = JSON.stringify({
        UserID: this.userInfo.ID,
        Token: this.userInfo.Token
      });
      this.getFansList();
    } else {
      this.$router.push("/login");
    }
  },
  methods: {
    changePage(currentPage) {
      this.pageParam.PageNumber = currentPage;
      this.getFansList();
    },
    async getFansList() {
      try {
        let postData = new FormData();
        postData.append("Act", "Fan_GetList");
        postData.append("Param", JSON.stringify(this.pageParam));
        postData.append("Verification", this.mediaConfig.verification);
        let response = await postActionHandler(postData);
        console.log(response);
        if (response.Result) {
          this.fansList = response.Data;
          this.mediaConfig.totalCount = response.Data.TotalCount;
        } else {
          this.$message({
            type: "error",
            message: response.Msg
          });
          if (response.Code == "User000012" || response.Code == "User000014") {
            localStorage.removeItem("adminInfo");
            this.$router.push("/");
          }
        }
      } catch (error) {
        console.log(error);
        this.$message({
          type: "error",
          message: error
        });
      }
    }
  }
};
</script>

<style scoped>
.fans-title {
  font-size: 18px;
  color: #222;
  border-bottom: 2px solid #eee;
}
.head-img {
  width: 48px;
  height: 48px;
  margin-top: 7px;
}
.user-table {
  font-weight: 400;
  margin: 10px 0;
}
.fans-list {
  width: 70%;
}
</style>