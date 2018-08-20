<template>
  <div>
    <el-row class="imgae-top">
      <el-col :span="12">
        <div class="image-count">{{ mediaType }}(共{{ mediaConfig.totalCount }}条)</div>
      </el-col>
      <el-col :span="8" class="tips">
        <span>{{ tipsText }} </span>
        <el-tooltip effect="dark" content="不添加水印" placement="top-start" v-if="mediaConfig.type==1">
          <i class="el-icon-warning"></i>
        </el-tooltip>
      </el-col>
      <el-col :span="4" class="upload-btn">
        <el-row>
          <el-col :span="12">
            <el-upload :action="upLoadUrl" :data="upLoadData" :show-file-list="false" :on-success="upLoadSuccess" :before-upload="beforeAvatarUpload" :on-progress="uploadProgress">
              <el-button size="default" type="primary" :loading="btnLoading">添加{{ mediaType }}</el-button>
            </el-upload>
          </el-col>
          <el-col :span="12">
            <el-button size="default" type="success" @click="syncImage" :loading="btnLoading">同步{{ mediaType }}</el-button>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { baseUrl } from "@/config/env";
import synchronize from "@/api/synchronize";
export default {
  props: ["mediaConfig"],
  data() {
    return {
      baseUrl,
      mediaType: "",
      tipsText: "",
      // mediaConfig: {
      //   type: 1,
      //   totalCount: 100
      // },
      upLoadUrl: baseUrl + "/ActionHandler.ashx",
      upLoadData: {
        Act: "Material_Add",
        Param: {
          Type: 1,
          Title: "image upload",
          Introduction: "image upload"
        },
        Verification: ""
      },
      btnLoading: false
    };
  },
  created() {
    if (this.mediaConfig.verification) {
      this.upLoadData.Verification = this.mediaConfig.verification;
      this.upLoadData.Param.Type = this.mediaConfig.type;
      switch (this.mediaConfig.type) {
        case 1:
          this.mediaType = "图片";
          this.tipsText = "大小不超过2M，已关闭图片水印";
          break;
        case 2:
          this.mediaType = "语音";
          this.tipsText =
            "格式支持mp3、wma、wav、amr，文件大小不超过2M，语音时长不超过60秒";
          break;
        case 3:
          this.mediaType = "视频";
          this.tipsText = "格式支持mp4，文件大小不超过10M";
          break;
        default:
          break;
      }
    }
    // 上传前将参数字符串化 后台只接受 Param 为string类型
    this.upLoadData.Param = JSON.stringify(this.upLoadData.Param);
  },
  methods: {
    upLoadSuccess(res, file) {
      if (res.Result) {
        Object.defineProperty(res.Data, "FileName", {
          value: file.name
        });
        console.log(res);
        this.$emit("uploadSuccess", res.Data);
        // this.imageList.List.unshift(res.Data);
      } else {
        this.$message.error("上传失败，请稍后重试!");
      }
      this.btnLoading = false;
    },
    upLoadError(err, file) {
      console.log(err);
      this.btnLoading = false;
    },
    beforeAvatarUpload(file) {
      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/jpg" ||
        file.type === "image/gif" ||
        file.type === "image/bmp";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传图片只能是 bmp/png/jpeg/jpg/gif 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    uploadProgress() {
      this.btnLoading = true;
    },
    async syncImage() {
      this.$syncProgress.show('正在同步...');
      // console.log(this.$syncProgress.);
      
      this.btnLoading = true;
      try {
        let response = await synchronize(this.mediaConfig);
        if (response) {
          this.$message.success("同步成功");
        } else {
          this.$message.error(`同步失败，${response.Msg}`);
        }
        this.$emit("syncSuccess", response);
        this.btnLoading = false;
      } catch (error) {
        this.$message.error(`同步出错，${error}`);
        this.btnLoading = false;
      }
    }
  }
};
</script>

<style scoped>
.imgae-top {
  line-height: 36px;
  padding: 2% 0;
}
.tips {
  font-size: 14px;
  text-align: right;
  padding-right: 1%;
}
.image-count {
  font-size: 20px;
}
.upload-btn {
  text-align: right;
}
</style>