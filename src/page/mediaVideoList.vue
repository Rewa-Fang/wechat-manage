<template>
  <div>

    <el-row class="imgae-top">
      <el-col :span="10">
        <div class="image-count">视频(共{{ videoList.TotalCount }}条)</div>
      </el-col>
      <el-col :span="10" class="tips">
        <span>格式支持mp4，文件大小不超过10M</span>
      </el-col>
      <el-col :span="4" class="upload-btn">
        <el-upload :action="upLoadVideoUrl" :data="upLoadVideoData" :show-file-list="false" :on-success="upLoadSuccess" :before-upload="beforeAvatarUpload">
          <el-button size="default" type="primary">添加视频</el-button>
        </el-upload>
      </el-col>
    </el-row>
    <!-- <div>分组标签</div> -->
    <el-row class="img-list">
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
            <span>{{ scope.row.CreatedDate | dateFormat }}</span>
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
  </div>
</template>

<script>
import { postActionHandler } from "@/api/getData";
export default {
  data() {
    return {
      userInfo: {},
      rowStyle: { 
        height: "130px"
      },
      videoList: {},
      upLoadVideoUrl:
        "http://wechat.a2designing.cn/Handlers/ActionHandler.ashx",
      upLoadVideoData: {
        Act: "Material_Add",
        Param:
          "{'Type':3, 'Title': 'video upload', 'Introduction': 'video upload'}",
        Verification: ""
      },
      // 设置获取列表的素材类型及分页设置
      pageParam: {
        Type: 3,
        PageSize: 0,
        PageNumber: 10
      }
    };
  },
  filters: {
    dateFormat(timestamp) {
      let date = new Date(timestamp * 1000);
      let year = date.getFullYear(),
        month = date.getMonth() + 1,
        day = date.getDate();
      let nowDateYear = new Date().getFullYear();
      if (year == nowDateYear) {
        return month + "月" + day + "日";
      } else {
        return year + "年" + month + "月" + day + "日";
      }
    }
  },
  created() {
    if (localStorage.adminInfo) {
      this.userInfo = JSON.parse(localStorage.adminInfo);
      this.upLoadVideoData.Verification = JSON.stringify({
        UserID: this.userInfo.ID,
        Token: this.userInfo.Token
      });
      this.getVideoList();
    } else {
      this.$router.push("/login");
    }
  },
  computed: {},
  methods: {
    upLoadSuccess(res, file) {
      if (res.Result) {
        let uploadTime = Date.parse(new Date()) / 1000;
        Object.defineProperty(res.Data, "CreatedDate", {
          value: uploadTime
        });
        Object.defineProperty(res.Data, "Introduction", {
          value: 'upload vidoe test'
        });
        Object.defineProperty(res.Data, "FileName", {
          value: file.name
        });
        this.videoList.List.unshift(res.Data);
      }
    },
    beforeAvatarUpload(file) {
      const isMP4 = file.type === "video/mp4";
      const isLt10M = file.size / 1024 / 1024 < 10;

      if (!isMP4) {
        this.$message.error("上传视频只能是 MP4 格式!");
      }
      if (!isLt10M) {
        this.$message.error("上传图片大小不能超过 10MB!");
      }
      return isMP4 && isLt10M;
    },
    async getVideoList() {
      try {
        let postData = new FormData();
        postData.append("Act", "Material_GetList");
        postData.append("Param", JSON.stringify(this.pageParam));
        postData.append("Verification", this.upLoadVideoData.Verification);
        let response = await postActionHandler(postData);
        console.log(response);
        if (response.Result) {
          this.videoList = response.Data;
        } else {
          this.$message({
            type: "error",
            message: response.Msg
          });
          if (response.Code == "User000012") {
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
          postData.append("Verification", this.upLoadVideoData.Verification);
          postData.append(
            "Param",
            JSON.stringify({
              ID: Number(ID)
            })
          );
          this.deleteVideoById(index,postData);
        })
        .catch(() => {});
    },
    async deleteVideoById(index,postData) {
      try {
        let res = await postActionHandler(postData);
        console.log(res);
        if (res.Result) {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.videoList.List.splice(index, 1);
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