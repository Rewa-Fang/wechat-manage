<template>
  <div>
    <!-- header add button, synchronize button -->
    <media-header :mediaConfig="mediaConfig" @uploadSuccess="uploadSuccess" @syncSuccess="syncSuccess"></media-header>
    <!-- <div>分组标签</div> -->
    <!-- video list -->
    <el-row class="img-list media-list3">
      <el-table :data="videoList.List" style="width: 100%" :row-style="rowStyle">
        <el-table-column label="标题">
          <template slot-scope="scope">
            <div class="vieio-tab-name">
              <!-- <img class="video-img" :src="scope.row.url" alt=""> -->
              <span style="margin-left: 10px">{{ scope.row.FileName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="描述">
          <template slot-scope="scope">
            <span>{{ scope.row.Introduction }}</span>
          </template>
        </el-table-column>
        <el-table-column label="更新时间">
          <template slot-scope="scope">
            <span>{{ scope.row.CreatedDate | dateFormatString }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="deleteVideo(scope.$index, scope.row.ID)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <!-- pagination components -->
    <my-pagination :pagiConfig="mediaConfig" @changePage="changePage" v-if="mediaConfig.totalCount > 0"></my-pagination>
  </div>
</template>

<script>
import { postActionHandler } from "@/api/getData";
import dateFormat from "@/filters/dateFormat";
import pagination from "./pagination";
import header from "./header";
export default {
  components: {
    myPagination: pagination,
    mediaHeader: header
  },
  data() {
    return {
      mediaConfig: {
        type: 3, //素材类型
        pageSize: 5,
        pagerCount: 7,
        verification: "",
        totalCount: 0, // 本地服务器素材总数
        wxTotalCount: 0 // 微信服务器素材总数
      },
      userInfo: {},
      rowStyle: {
        height: "130px"
      },
      videoList: {},
      // 设置获取列表的素材类型及分页设置
      pageParam: {
        Type: 3,
        PageSize: 5,
        PageNumber: 1
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
      this.getVideoList();
      this.getCount();
    } else {
      this.$router.push("/login");
    }
  },
  computed: {},
  methods: {
    changePage(currentPage) {
      this.pageParam.PageNumber = currentPage;
      this.getVideoList();
    },
    syncSuccess(response) {
      if (response) {
        this.getVideoList();
        this.getCount();
      }
    },
    uploadSuccess(data) {
      let uploadTime = Date.parse(new Date()) / 1000;
      Object.defineProperty(data, "CreatedDate", {
        value: uploadTime
      });
      Object.defineProperty(data, "Introduction", {
        value: "upload vidoe test"
      });
      this.videoList.List.unshift(data);
      if (this.videoList.List.length > this.pageParam.PageSize) {
        this.videoList.List.pop();
      }
      this.mediaConfig.totalCount++;
    },
    async getVideoList() {
      try {
        let postData = new FormData();
        postData.append("Act", "Material_GetList");
        postData.append("Param", JSON.stringify(this.pageParam));
        postData.append("Verification", this.mediaConfig.verification);
        let response = await postActionHandler(postData);
        if (response.Result) {
          console.log(response);
          this.videoList = response.Data;
          this.mediaConfig.totalCount = response.Data.TotalCount;
        } else {
          console.log(response);
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
    },
    async getCount() {
      try {
        let postData = new FormData();
        postData.append("Act", "Material_GetCountWX");
        postData.append("Param", "{}");
        postData.append("Verification", this.mediaConfig.verification);
        let response = await postActionHandler(postData);
        if (response.Result) {
          this.mediaConfig.wxTotalCount = response.Data.video_count;
        }
      } catch (error) {
        console.log(error);
      }
    },
    deleteVideo(index, ID) {
      this.$confirm("此操作将永久删除该视频, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          console.log(index, ID);
          let postData = new FormData();
          postData.append("Act", "Material_Del");
          postData.append("Verification", this.mediaConfig.verification);
          postData.append(
            "Param",
            JSON.stringify({
              ID: Number(ID)
            })
          );
          this.deleteVideoById(index, postData);
        })
        .catch(() => {});
    },
    async deleteVideoById(index, postData) {
      try {
        let res = await postActionHandler(postData);
        console.log(res);
        if (res.Result) {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          // this.videoList.List.splice(index, 1);
          this.getVideoList();
        } else {
          this.$message({
            type: "error",
            message: "删除失败!" + res.Msg
          });
        }
      } catch (error) {
        this.$message({
          type: "error",
          message: "删除错误!" + error
        });
      }
    }
  }
};
</script>

<style scoped>
.imgae-top {
  line-height: 36px;
  padding: 2%;
}
.img-list {
  padding: 2%;
}
.vieio-tab-name {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.video-img {
  width: 160px;
  height: 90px;
}
.tips {
  font-size: 14px;
  text-align: right;
  padding-right: 1%;
}
</style>