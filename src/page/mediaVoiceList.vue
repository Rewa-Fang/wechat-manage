<template>
  <div>
    <el-row class="imgae-top">
      <el-col :span="6">
        <div class="image-count">语音(共{{ voiceList.TotalCount }}条)</div>
      </el-col>
      <el-col :span="14" class="tips">
        <span>格式支持mp3、wma、wav、amr，文件大小不超过2M，语音时长不超过60秒</span>
      </el-col>
      <el-col :span="4" class="upload-btn">
        <el-upload class="upload-demo" :action="upLoadUrl" :data="upLoadData" :show-file-list="false" :on-success="upLoadSuccess" :before-upload="beforeAvatarUpload">
          <el-button size="default" type="primary">添加语音</el-button>
        </el-upload>
      </el-col>
    </el-row>
    <!-- <div>分组标签</div> -->
    <el-row class="img-list">
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
  </div>
</template>

<script>
import { postActionHandler } from "@/api/getData";
import { baseImgPath, baseUrl } from "@/config/env";
export default {
  data() {
    return {
      voiceIcon: require("@/assets/img/voice.png"),
      baseImgPath,
      baseUrl,
      userInfo: {},
      rowStyle: {
        height: "80px"
      },
      voiceList: {},
      upLoadUrl: baseUrl + "/ActionHandler.ashx",
      upLoadData: {
        Act: "Material_Add",
        Param:
          "{'Type':2, 'Title': 'voice upload', 'Introduction': 'voice upload'}",
        Verification: ""
      },
      // 设置获取列表的素材类型及分页设置
      // 设置获取列表的素材类型及分页设置
      pageParam: {
        Type: 2,
        PageSize: 0,
        PageNumber: 10
      },
      curPlayVoice: {},
      curPlayMediaId: ""
    };
  },
  created() {
    if (localStorage.adminInfo) {
      this.userInfo = JSON.parse(localStorage.adminInfo);
      this.upLoadData.Verification = JSON.stringify({
        UserID: this.userInfo.ID,
        Token: this.userInfo.Token
      });
      this.getVoiceList();
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
    upLoadSuccess(res, file) {
      if (res.Result) {
        let uploadTime = Date.parse(new Date()) / 1000;
        Object.defineProperty(res.Data, "CreatedDate", {
          value: uploadTime
        });
        Object.defineProperty(res.Data, "FileName", {
          value: file.name
        });
        this.voiceList.List.unshift(res.Data);
      }
    },
    beforeAvatarUpload(file) {
      console.log(file);
      const isVoice =
        file.type === "audio/mp3" ||
        file.type === "audio/x-ms-wma" ||
        file.type === "audio/wav" ||
        file.type === "";
      const isLt30M = file.size / 1024 / 1024 < 2;

      if (!isVoice) {
        this.$message.error("上传语音只能是 mp3/wav/wma/amr 格式!");
      }
      if (!isLt30M) {
        this.$message.error("上传语音大小不能超过 2MB!");
      }
      return isVoice && isLt30M;
    },
    async getVoiceList() {
      try {
        let postData = new FormData();
        postData.append("Act", "Material_GetList");
        postData.append("Param", JSON.stringify(this.pageParam));
        postData.append("Verification", this.upLoadData.Verification);
        let response = await postActionHandler(postData);
        console.log(response);
        if (response.Result) {
          this.voiceList = response.Data;
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
          postData.append("Verification", this.upLoadData.Verification);
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
          this.voiceList.List.splice(index, 1);
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