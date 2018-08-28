<template>
  <div>
    <!-- header add button, synchronize button -->
    <media-header :mediaConfig="mediaConfig" @uploadSuccess="uploadSuccess" @syncSuccess="syncSuccess"></media-header>
    <!-- <div>分组标签</div> -->
    <!-- voice list -->
    <el-row class="img-list media-list2">
      <el-table :data="voiceList.List" style="width: 100%" :row-style="rowStyle">
        <el-table-column label="名称">
          <template slot-scope="scope">
            <div class="voice-tab-name">
              <audio :src="baseImgPath+voiceList.Path+'/'+scope.row.FileRealName" :id="scope.row.MediaId"></audio>
              <img class="voice-img" :src="voiceIcon" alt="" @click="playVoice(scope.row.MediaId)">
              <span style="margin-left: 10px">{{ scope.row.FileName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="更新时间">
          <template slot-scope="scope">
            <span>{{ scope.row.CreatedDate | dateFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <a class="updown-btn" :href="baseImgPath+voiceList.Path+'/'+scope.row.FileRealName" download>下载</a>
            <!-- <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button> -->
            <el-button size="mini" type="danger" @click="deleteVoice(scope.$index, scope.row.ID)">删除</el-button>
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
import { baseImgPath } from "@/config/env";
import pagination from "./pagination";
import header from "./header";
export default {
  props:['activeName'],
  components: {
    myPagination: pagination,
    mediaHeader: header
  },
  data() {
    return {
      mediaConfig: {
        type: 2,
        pageSize: 10,
        pagerCount: 7,
        verification: "",
        totalCount: 0, // 本地服务器素材总数
        wxTotalCount: 0 // 微信服务器素材总数
      },
      voiceIcon: require("@/assets/img/voice.png"),
      baseImgPath,
      userInfo: {},
      rowStyle: {
        height: "80px"
      },
      voiceList: {},
      // 设置获取列表的素材类型及分页设置
      // 设置获取列表的素材类型及分页设置
      pageParam: {
        Type: 2,
        PageSize: 10,
        PageNumber: 1
      },
      curPlayVoice: {},
      curPlayMediaId: ""
    };
  },
  watch:{
    activeName(newVal){
      if(newVal != 'voice'){  // 监测tabs切换 停止语音播放
        this.curPlayVoice.pause();
      }
    }
  },
  created() {
    if (localStorage.adminInfo) {
      this.userInfo = JSON.parse(localStorage.adminInfo);
      this.mediaConfig.verification = JSON.stringify({
        UserID: this.userInfo.ID,
        Token: this.userInfo.Token
      });
      this.getVoiceList();
      this.getCount();
    } else {
      this.$router.push("/login");
    }
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
  methods: {
    changePage(currentPage) {
      this.pageParam.PageNumber = currentPage;
      this.getVoiceList();
    },
    syncSuccess(response) {
      if (response) {
        this.getVoiceList();
        this.getCount();
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
          this.mediaConfig.wxTotalCount = response.Data.voice_count;
        }
      } catch (error) {
        console.log(error);
      }
    },
    uploadSuccess(data) {
      let uploadTime = Date.parse(new Date()) / 1000;
      Object.defineProperty(data, "CreatedDate", {
        value: uploadTime
      });
      this.voiceList.List.unshift(data);
      if (this.voiceList.List.length > this.pageParam.PageSize) {
        this.voiceList.List.pop();
      }
      this.mediaConfig.totalCount++;
    },
    async getVoiceList() {
      try {
        let postData = new FormData();
        postData.append("Act", "Material_GetList");
        postData.append("Param", JSON.stringify(this.pageParam));
        postData.append("Verification", this.mediaConfig.verification);
        let response = await postActionHandler(postData);
        if (response.Result) {
          console.log(response);
          this.voiceList = response.Data;
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
    updownVoice(index, row) {
      window.open(
        this.baseImgPath + this.voiceList.Path + "/" + row.FileRealName
      );
    },
    playVoice(media_id) {
      let audio;
      if (!this.curPlayMediaId) {
        audio = document.querySelector("#" + media_id);
        audio.play();
        this.curPlayMediaId = media_id;
        this.curPlayVoice = audio;
      } else {
        if (this.curPlayMediaId == media_id) {
          this.curPlayVoice.pause();
          this.curPlayVoice.currentTime = 0;
          this.curPlayVoice = {};
          this.curPlayMediaId = "";
        } else {
          this.curPlayVoice.pause();
          this.curPlayVoice.currentTime = 0;
          audio = document.querySelector("#" + media_id);
          audio.play();
          this.curPlayMediaId = media_id;
          this.curPlayVoice = audio;
        }
      }
    },
    deleteVoice(index, ID) {
      this.$confirm("此操作将永久删除该语音, 是否继续?", "提示", {
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
          this.deleteVoiceById(index, postData);
        })
        .catch(() => {});
    },
    async deleteVoiceById(index, postData) {
      try {
        let res = await postActionHandler(postData);
        console.log(res);
        if (res.Result) {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          // this.voiceList.List.splice(index, 1);
          this.getVoiceList();
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
.voice-tab-name {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.voice-img {
  width: 32px;
  height: 32px;
}
.updown-btn {
  display: inline-block;
  padding: 4px;
  font-size: 12px;
  border-radius: 4px;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #20a0ff;
  border: 1px solid #c4c4c4;
  color: #ffffff;
  margin-right: 10px;
}
.tips {
  font-size: 14px;
  text-align: right;
  padding-right: 1%;
}
</style>